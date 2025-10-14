import { SocialService } from '../../services/social/socialService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class SocialController {
  constructor() {
    this.socialService = new SocialService();
  }

  // Get social feed
  getSocialFeed = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query;
    const feed = await this.socialService.getSocialFeed(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      type
    });

    res.json({
      success: true,
      data: feed
    });
  });

  // Create post
  createPost = asyncHandler(async (req, res) => {
    const post = await this.socialService.createPost(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  });

  // Get post by ID
  getPost = asyncHandler(async (req, res) => {
    const post = await this.socialService.getPost(req.params.postId);

    res.json({
      success: true,
      data: post
    });
  });

  // Update post
  updatePost = asyncHandler(async (req, res) => {
    const post = await this.socialService.updatePost(
      req.params.postId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  });

  // Delete post
  deletePost = asyncHandler(async (req, res) => {
    await this.socialService.deletePost(req.params.postId, req.user.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  });

  // Like post
  likePost = asyncHandler(async (req, res) => {
    const result = await this.socialService.likePost(
      req.params.postId,
      req.user.id
    );

    res.json({
      success: true,
      message: result.liked ? 'Post liked' : 'Post unliked',
      data: result
    });
  });

  // Share post
  sharePost = asyncHandler(async (req, res) => {
    const result = await this.socialService.sharePost(
      req.params.postId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Post shared successfully',
      data: result
    });
  });

  // Get post comments
  getPostComments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const comments = await this.socialService.getPostComments(
      req.params.postId,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: comments
    });
  });

  // Add comment
  addComment = asyncHandler(async (req, res) => {
    const { content, parentId } = req.body;
    const comment = await this.socialService.addComment(
      req.params.postId,
      content,
      req.user.id,
      parentId
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  });

  // Update comment
  updateComment = asyncHandler(async (req, res) => {
    const comment = await this.socialService.updateComment(
      req.params.commentId,
      req.body.content,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  });

  // Delete comment
  deleteComment = asyncHandler(async (req, res) => {
    await this.socialService.deleteComment(req.params.commentId, req.user.id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  });

  // Like comment
  likeComment = asyncHandler(async (req, res) => {
    const result = await this.socialService.likeComment(
      req.params.commentId,
      req.user.id
    );

    res.json({
      success: true,
      message: result.liked ? 'Comment liked' : 'Comment unliked',
      data: result
    });
  });

  // Follow user
  followUser = asyncHandler(async (req, res) => {
    const result = await this.socialService.followUser(
      req.params.userId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'User followed successfully',
      data: result
    });
  });

  // Unfollow user
  unfollowUser = asyncHandler(async (req, res) => {
    await this.socialService.unfollowUser(req.params.userId, req.user.id);

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  });

  // Get user followers
  getUserFollowers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const followers = await this.socialService.getUserFollowers(
      req.params.userId,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: followers
    });
  });

  // Get user following
  getUserFollowing = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const following = await this.socialService.getUserFollowing(
      req.params.userId,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: following
    });
  });

  // Get user posts
  getUserPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query;
    const posts = await this.socialService.getUserPosts(
      req.params.userId,
      { page: parseInt(page), limit: parseInt(limit), type }
    );

    res.json({
      success: true,
      data: posts
    });
  });

  // Search posts
  searchPosts = asyncHandler(async (req, res) => {
    const { q, type, page = 1, limit = 20 } = req.query;
    const posts = await this.socialService.searchPosts({
      query: q,
      type,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: posts
    });
  });

  // Get trending posts
  getTrendingPosts = asyncHandler(async (req, res) => {
    const { period = '24h', limit = 10 } = req.query;
    const posts = await this.socialService.getTrendingPosts(
      period,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: posts
    });
  });

  // Get social analytics
  getSocialAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.socialService.getSocialAnalytics(
      req.user.id,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });
}
