import jwt from 'jsonwebtoken';
import { User, UserRole } from '../../entities/auth/User.js';
import { configs } from '../../config/index.js';
import { AppError } from '../../middleware/error/errorHandler.js';

const PROFILE_FIELDS = 'email firstName lastName role phone avatar bio address city state zipCode country website socialMedia rating totalReviews isEmailVerified createdAt';

export class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, role = UserRole.BUYER, phone } = userData;

    // Check if user already exists
    const existingUser = await User.exists({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const savedUser = await User.create({ email, password, firstName, lastName, role, phone });
    return this.generateTokens(savedUser);
  }

  async login(email, password) {
    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, configs.jwt.refreshSecret);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, configs.jwt.secret, {
      expiresIn: configs.jwt.expiresIn
    });

    const refreshToken = jwt.sign(payload, configs.jwt.refreshSecret, {
      expiresIn: configs.jwt.refreshExpiresIn
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified
      }
    };
  }

  async verifyEmail(userId) {
    const user = await User.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async resetPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      configs.jwt.secret,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset email sent' };
  }

  async confirmPasswordReset(token, newPassword) {
    try {
      const decoded = jwt.verify(token, configs.jwt.secret);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError('Invalid reset token', 400);
      }

      user.password = newPassword;
      await user.save();
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select(PROFILE_FIELDS);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'address', 'city', 'state', 'zipCode', 'country', 'website', 'socialMedia'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();
    return this.getProfile(userId);
  }

  async deactivateAccount(userId) {
    const user = await User.findByIdAndUpdate(userId, { isActive: false });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { message: 'Account deactivated successfully' };
  }
}
