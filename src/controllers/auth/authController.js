import { AuthService } from '../../services/auth/authService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    
    const result = await this.authService.register({
      firstName,
      lastName,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const result = await this.authService.login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    const result = await this.authService.refreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  });

  getProfile = asyncHandler(async (req, res) => {
    const profile = await this.authService.getProfile(req.user.id);

    res.json({
      success: true,
      data: profile
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const updatedProfile = await this.authService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    const result = await this.authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      message: result.message
    });
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await this.authService.verifyEmail(userId);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: user
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    const result = await this.authService.resetPassword(email);

    res.json({
      success: true,
      message: result.message
    });
  });

  confirmPasswordReset = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    
    const result = await this.authService.confirmPasswordReset(token, newPassword);

    res.json({
      success: true,
      message: result.message
    });
  });

  deactivateAccount = asyncHandler(async (req, res) => {
    const result = await this.authService.deactivateAccount(req.user.id);

    res.json({
      success: true,
      message: result.message
    });
  });
}
