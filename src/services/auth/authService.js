import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/database.js';
import { User, UserRole } from '../../entities/auth/User.js';
import { configs } from '../../config/index.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class AuthService {
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData) {
    const { email, password, firstName, lastName, role = UserRole.BUYER } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Create new user
    const user = this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      role
    });

    const savedUser = await this.userRepository.save(user);
    return this.generateTokens(savedUser);
  }

  async login(email, password) {
    // Find user with password
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive', 'isEmailVerified']
    });

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
      const user = await this.userRepository.findOne({ 
        where: { id: decoded.userId },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'isEmailVerified']
      });

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
        isEmailVerified: user.isEmailVerified
      }
    };
  }

  async verifyEmail(userId) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isEmailVerified = true;
    await this.userRepository.save(user);
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async resetPassword(email) {
    const user = await this.userRepository.findOne({ where: { email } });
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
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

      if (!user) {
        throw new AppError('Invalid reset token', 400);
      }

      user.password = newPassword;
      await this.userRepository.save(user);
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  async getProfile(userId) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'phone', 'avatar', 'bio', 'address', 'city', 'state', 'zipCode', 'country', 'website', 'socialMedia', 'rating', 'totalReviews', 'isEmailVerified', 'createdAt']
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
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

    const updatedUser = await this.userRepository.save(user);
    return this.getProfile(userId);
  }

  async deactivateAccount(userId) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = false;
    await this.userRepository.save(user);
    return { message: 'Account deactivated successfully' };
  }
}
