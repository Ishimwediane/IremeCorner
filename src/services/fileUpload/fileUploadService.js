import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { configs } from '../../config/index.js';
import { CloudinaryService } from '../cloudinary/cloudinaryService.js';
import { AppError } from '../../middleware/error/errorHandler.js';

// Configure storage for temporary files
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
    } else if (file.fieldname === 'courseVideos') {
      uploadPath = path.join(uploadPath, 'courses', 'videos');
    } else if (file.fieldname === 'courseDocuments') {
      uploadPath = path.join(uploadPath, 'courses', 'documents');
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
    'video/quicktime': '.mov',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/plain': '.txt'
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
export const uploadCourseVideos = upload.array('courseVideos', 10);
export const uploadCourseDocuments = upload.array('courseDocuments', 10);

// Generic media file upload for content management
export const uploadMediaFile = upload.array('mediaFiles', 10);

export class FileUploadService {
  static async uploadFileToCloudinary(file, type, folder, transformations = {}) {
    try {
      let result;
      
      switch (type) {
        case 'image':
          result = await CloudinaryService.uploadImage(file, folder);
          break;
        case 'video':
          result = await CloudinaryService.uploadVideo(file, folder);
          break;
        case 'document':
          result = await CloudinaryService.uploadDocument(file, folder);
          break;
        default:
          throw new AppError('Invalid file type', 400);
      }

      return result;
    } catch (error) {
      throw new AppError('File upload failed', 500);
    }
  }

  static async uploadCourseThumbnailToCloudinary(file, courseId) {
    try {
      const result = await CloudinaryService.uploadCourseThumbnail(file, courseId);
      return result;
    } catch (error) {
      throw new AppError('Course thumbnail upload failed', 500);
    }
  }

  static async uploadCourseImagesToCloudinary(files, courseId) {
    try {
      const results = await CloudinaryService.uploadCourseImages(files, courseId);
      return results;
    } catch (error) {
      throw new AppError('Course images upload failed', 500);
    }
  }

  static async uploadCourseVideosToCloudinary(files, courseId) {
    try {
      const results = await CloudinaryService.uploadCourseVideos(files, courseId);
      return results;
    } catch (error) {
      throw new AppError('Course videos upload failed', 500);
    }
  }

  static async uploadCourseDocumentsToCloudinary(files, courseId) {
    try {
      const results = await CloudinaryService.uploadCourseDocuments(files, courseId);
      return results;
    } catch (error) {
      throw new AppError('Course documents upload failed', 500);
    }
  }

  static async uploadProductImageToCloudinary(file, productId) {
    try {
      const result = await CloudinaryService.uploadProductImage(file, productId);
      return result;
    } catch (error) {
      throw new AppError('Product image upload failed', 500);
    }
  }

  static async uploadUserAvatarToCloudinary(file, userId) {
    try {
      const result = await CloudinaryService.uploadUserAvatar(file, userId);
      return result;
    } catch (error) {
      throw new AppError('Avatar upload failed', 500);
    }
  }

  static async deleteFileFromCloudinary(publicId) {
    try {
      const result = await CloudinaryService.deleteFile(publicId);
      return result;
    } catch (error) {
      throw new AppError('File deletion failed', 500);
    }
  }

  static async deleteMultipleFilesFromCloudinary(publicIds) {
    try {
      const result = await CloudinaryService.deleteMultipleFiles(publicIds);
      return result;
    } catch (error) {
      throw new AppError('Files deletion failed', 500);
    }
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

  static validateVideoFile(file) {
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
    
    if (!allowedVideoTypes.includes(file.mimetype)) {
      throw new AppError('Only MP4, AVI, and MOV video files are allowed', 400);
    }

    if (file.size > configs.upload.maxFileSize * 10) { // 100MB for videos
      throw new AppError('Video file size exceeds maximum allowed size', 400);
    }

    return true;
  }

  static validateDocumentFile(file) {
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    
    if (!allowedDocTypes.includes(file.mimetype)) {
      throw new AppError('Only PDF, Word, Excel, and text documents are allowed', 400);
    }

    if (file.size > configs.upload.maxFileSize) {
      throw new AppError('Document file size exceeds maximum allowed size', 400);
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

  static getFileType(mimetype) {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('application/') || mimetype.startsWith('text/')) return 'document';
    return 'unknown';
  }
}