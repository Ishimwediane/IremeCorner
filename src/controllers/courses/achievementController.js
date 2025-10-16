import { AchievementService } from '../../services/courses/achievementService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class AchievementController {
  constructor() {
    this.achievementService = new AchievementService();
  }

  // Get all achievements
  getAllAchievements = asyncHandler(async (req, res) => {
    const achievements = await this.achievementService.getAllAchievements();

    res.json({
      success: true,
      data: achievements
    });
  });

  // Get user's achievements
  getMyAchievements = asyncHandler(async (req, res) => {
    const achievements = await this.achievementService.getUserAchievements(req.user.id);

    res.json({
      success: true,
      data: achievements
    });
  });

  // Create achievement (Admin only)
  createAchievement = asyncHandler(async (req, res) => {
    const achievement = await this.achievementService.createAchievement(req.body);

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  });

  // Update achievement (Admin only)
  updateAchievement = asyncHandler(async (req, res) => {
    const achievement = await this.achievementService.updateAchievement(
      req.params.achievementId,
      req.body
    );

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  });

  // Delete achievement (Admin only)
  deleteAchievement = asyncHandler(async (req, res) => {
    await this.achievementService.deleteAchievement(req.params.achievementId);

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  });

  // Award achievement to user (Admin only)
  awardAchievement = asyncHandler(async (req, res) => {
    const { userId, courseId } = req.body;
    const result = await this.achievementService.awardAchievement(
      req.params.achievementId,
      userId,
      courseId
    );

    res.json({
      success: true,
      message: 'Achievement awarded successfully',
      data: result
    });
  });

  // Check and award achievements for user progress
  checkAchievements = asyncHandler(async (req, res) => {
    const achievements = await this.achievementService.checkAndAwardAchievements(
      req.user.id,
      req.params.courseId
    );

    res.json({
      success: true,
      message: 'Achievements checked and awarded',
      data: achievements
    });
  });
}



