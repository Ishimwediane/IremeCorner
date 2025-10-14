import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { configs } from '../../config/index.js';
import { AppError } from '../../middleware/error/errorHandler.js';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = configs.upload.uploadPath;
    
    // Determine upload path based on file type
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(uploadPath, 'avatars');
    } else if (file.fieldname === 'productImages') {
      uploadPath = path.join(uploadPath, 'products');
    } else if (file.fieldname === 'courseImages' || file.fieldname === 'courseThumbnail') {
      uploadPath = path.join(uploadPath, 'courses');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/avi': '.avi',
    'video/mov': '.mov',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: configs.upload.maxFileSize, // 10MB
    files: 10 // Maximum 10 files per request
  }
});

// Specific upload configurations
export const uploadAvatar = upload.single('avatar');
export const uploadProductImages = upload.array('productImages', 5);
export const uploadCourseImages = upload.array('courseImages', 5);
export const uploadCourseThumbnail = upload.single('courseThumbnail');
export const uploadDocuments = upload.array('documents', 10);

export class FileUploadService {
  static async uploadFile(file, destination) {
    try {
      // This would typically involve cloud storage like AWS S3, Cloudinary, etc.
      // For now, we'll return the local file path
      return {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new AppError('File upload failed', 500);
    }
  }

  static async deleteFile(filePath) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      // Check if file exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  static async getFileUrl(filePath) {
    // In production, this would return the cloud storage URL
    // For development, return the local path
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${filePath}`;
  }

  static validateImageFile(file) {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new AppError('Only image files are allowed', 400);
    }

    if (file.size > configs.upload.maxFileSize) {
      throw new AppError('File size exceeds maximum allowed size', 400);
    }

    return true;
  }

  static validateDocumentFile(file) {
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedDocTypes.includes(file.mimetype)) {
      throw new AppError('Only PDF and Word documents are allowed', 400);
    }

    if (file.size > configs.upload.maxFileSize) {
      throw new AppError('File size exceeds maximum allowed size', 400);
    }

    return true;
  }

  static validateVideoFile(file) {
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov'];
    
    if (!allowedVideoTypes.includes(file.mimetype)) {
      throw new AppError('Only MP4, AVI, and MOV video files are allowed', 400);
    }

    if (file.size > configs.upload.maxFileSize * 5) { // 50MB for videos
      throw new AppError('Video file size exceeds maximum allowed size', 400);
    }

    return true;
  }

  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  static generateUniqueFilename(originalName) {
    const ext = this.getFileExtension(originalName);
    return `${uuidv4()}-${Date.now()}${ext}`;
  }
}
