import { v2 as cloudinary } from 'cloudinary';
import { configs } from '../../config/index.js';
import { AppError } from '../../middleware/error/errorHandler.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: configs.cloudinary.cloudName,
  api_key: configs.cloudinary.apiKey,
  api_secret: configs.cloudinary.apiSecret,
});

export class CloudinaryService {
  static async uploadImage(file, folder = 'iremecorner') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new AppError('Image upload failed', 500);
    }
  }

  static async uploadVideo(file, folder = 'iremecorner/videos') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'video',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        duration: result.duration,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      throw new AppError('Video upload failed', 500);
    }
  }

  static async uploadDocument(file, folder = 'iremecorner/documents') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'raw',
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary document upload error:', error);
      throw new AppError('Document upload failed', 500);
    }
  }

  static async uploadCourseThumbnail(file, courseId) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `iremecorner/courses/${courseId}`,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'fill', gravity: 'center' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary course thumbnail upload error:', error);
      throw new AppError('Course thumbnail upload failed', 500);
    }
  }

  static async uploadCourseImages(files, courseId) {
    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: `iremecorner/courses/${courseId}/images`,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'fill', gravity: 'center' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
        })
      );

      const results = await Promise.all(uploadPromises);

      return results.map(result => ({
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      }));
    } catch (error) {
      console.error('Cloudinary course images upload error:', error);
      throw new AppError('Course images upload failed', 500);
    }
  }

  static async uploadCourseVideos(files, courseId) {
    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: `iremecorner/courses/${courseId}/videos`,
          resource_type: 'video',
          quality: 'auto',
          fetch_format: 'auto',
        })
      );

      const results = await Promise.all(uploadPromises);

      return results.map(result => ({
        publicId: result.public_id,
        url: result.secure_url,
        duration: result.duration,
        format: result.format,
        bytes: result.bytes,
      }));
    } catch (error) {
      console.error('Cloudinary course videos upload error:', error);
      throw new AppError('Course videos upload failed', 500);
    }
  }

  static async uploadCourseDocuments(files, courseId) {
    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: `iremecorner/courses/${courseId}/documents`,
          resource_type: 'raw',
        })
      );

      const results = await Promise.all(uploadPromises);

      return results.map(result => ({
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
      }));
    } catch (error) {
      console.error('Cloudinary course documents upload error:', error);
      throw new AppError('Course documents upload failed', 500);
    }
  }

  static async uploadProductImage(file, productId) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `iremecorner/products/${productId}`,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 1000, height: 1000, crop: 'fill', gravity: 'center' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary product image upload error:', error);
      throw new AppError('Product image upload failed', 500);
    }
  }

  static async uploadUserAvatar(file, userId) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `iremecorner/users/${userId}`,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary avatar upload error:', error);
      throw new AppError('Avatar upload failed', 500);
    }
  }

  static async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new AppError('File deletion failed', 500);
    }
  }

  static async deleteMultipleFiles(publicIds) {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error) {
      console.error('Cloudinary bulk delete error:', error);
      throw new AppError('Files deletion failed', 500);
    }
  }

  static async getFileInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary get file info error:', error);
      throw new AppError('File info retrieval failed', 500);
    }
  }

  static generateImageUrl(publicId, transformations = {}) {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true,
    });
  }

  static generateVideoUrl(publicId, transformations = {}) {
    return cloudinary.video_url(publicId, {
      ...transformations,
      secure: true,
    });
  }
}


