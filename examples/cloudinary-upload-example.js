// Example usage of Cloudinary Integration for Course Uploads

import { CloudinaryService } from './src/services/cloudinary/cloudinaryService.js';
import { FileUploadService } from './src/services/fileUpload/fileUploadService.js';

// Example: Upload course thumbnail
async function uploadCourseThumbnail(file, courseId) {
  try {
    const result = await CloudinaryService.uploadCourseThumbnail(file, courseId);
    
    console.log('Course thumbnail uploaded successfully!');
    console.log('URL:', result.url);
    console.log('Public ID:', result.publicId);
    console.log('Dimensions:', `${result.width}x${result.height}`);
    
    return result;
  } catch (error) {
    console.error('Thumbnail upload failed:', error.message);
    throw error;
  }
}

// Example: Upload multiple course images
async function uploadCourseImages(files, courseId) {
  try {
    const results = await CloudinaryService.uploadCourseImages(files, courseId);
    
    console.log('Course images uploaded successfully!');
    console.log('Number of images:', results.length);
    
    results.forEach((result, index) => {
      console.log(`Image ${index + 1}:`);
      console.log('  URL:', result.url);
      console.log('  Public ID:', result.publicId);
      console.log('  Dimensions:', `${result.width}x${result.height}`);
      console.log('  Size:', `${(result.bytes / 1024).toFixed(2)} KB`);
    });
    
    return results;
  } catch (error) {
    console.error('Images upload failed:', error.message);
    throw error;
  }
}

// Example: Upload course videos
async function uploadCourseVideos(files, courseId) {
  try {
    const results = await CloudinaryService.uploadCourseVideos(files, courseId);
    
    console.log('Course videos uploaded successfully!');
    console.log('Number of videos:', results.length);
    
    results.forEach((result, index) => {
      console.log(`Video ${index + 1}:`);
      console.log('  URL:', result.url);
      console.log('  Public ID:', result.publicId);
      console.log('  Duration:', `${result.duration}s`);
      console.log('  Size:', `${(result.bytes / 1024 / 1024).toFixed(2)} MB`);
    });
    
    return results;
  } catch (error) {
    console.error('Videos upload failed:', error.message);
    throw error;
  }
}

// Example: Upload course documents
async function uploadCourseDocuments(files, courseId) {
  try {
    const results = await CloudinaryService.uploadCourseDocuments(files, courseId);
    
    console.log('Course documents uploaded successfully!');
    console.log('Number of documents:', results.length);
    
    results.forEach((result, index) => {
      console.log(`Document ${index + 1}:`);
      console.log('  URL:', result.url);
      console.log('  Public ID:', result.publicId);
      console.log('  Format:', result.format);
      console.log('  Size:', `${(result.bytes / 1024).toFixed(2)} KB`);
    });
    
    return results;
  } catch (error) {
    console.error('Documents upload failed:', error.message);
    throw error;
  }
}

// Example: Delete a file from Cloudinary
async function deleteCourseFile(publicId) {
  try {
    const result = await CloudinaryService.deleteFile(publicId);
    
    console.log('File deleted successfully!');
    console.log('Result:', result.result);
    
    return result;
  } catch (error) {
    console.error('File deletion failed:', error.message);
    throw error;
  }
}

// Example: Generate optimized image URLs
function generateOptimizedImageUrl(publicId, width = 800, height = 600) {
  return CloudinaryService.generateImageUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'center',
    quality: 'auto',
    fetch_format: 'auto'
  });
}

// Example: Generate responsive image URLs
function generateResponsiveImageUrls(publicId) {
  return {
    small: generateOptimizedImageUrl(publicId, 400, 300),
    medium: generateOptimizedImageUrl(publicId, 800, 600),
    large: generateOptimizedImageUrl(publicId, 1200, 900),
    thumbnail: generateOptimizedImageUrl(publicId, 200, 150)
  };
}

// Example: Frontend integration
function createCourseUploadForm() {
  const form = document.createElement('form');
  form.id = 'courseUploadForm';
  
  // Thumbnail upload
  const thumbnailInput = document.createElement('input');
  thumbnailInput.type = 'file';
  thumbnailInput.name = 'courseThumbnail';
  thumbnailInput.accept = 'image/*';
  thumbnailInput.required = true;
  
  // Images upload
  const imagesInput = document.createElement('input');
  imagesInput.type = 'file';
  imagesInput.name = 'courseImages';
  imagesInput.accept = 'image/*';
  imagesInput.multiple = true;
  
  // Videos upload
  const videosInput = document.createElement('input');
  videosInput.type = 'file';
  videosInput.name = 'courseVideos';
  videosInput.accept = 'video/*';
  videosInput.multiple = true;
  
  // Documents upload
  const documentsInput = document.createElement('input');
  documentsInput.type = 'file';
  documentsInput.name = 'courseDocuments';
  documentsInput.accept = '.pdf,.doc,.docx,.txt';
  documentsInput.multiple = true;
  
  form.appendChild(thumbnailInput);
  form.appendChild(imagesInput);
  form.appendChild(videosInput);
  form.appendChild(documentsInput);
  
  return form;
}

// Example: Handle form submission
async function handleCourseUpload(formData, courseId) {
  try {
    // Upload thumbnail
    if (formData.get('courseThumbnail')) {
      const thumbnailResult = await uploadCourseThumbnail(
        formData.get('courseThumbnail'), 
        courseId
      );
      console.log('Thumbnail uploaded:', thumbnailResult.url);
    }
    
    // Upload images
    const imageFiles = formData.getAll('courseImages');
    if (imageFiles.length > 0) {
      const imagesResult = await uploadCourseImages(imageFiles, courseId);
      console.log('Images uploaded:', imagesResult.length);
    }
    
    // Upload videos
    const videoFiles = formData.getAll('courseVideos');
    if (videoFiles.length > 0) {
      const videosResult = await uploadCourseVideos(videoFiles, courseId);
      console.log('Videos uploaded:', videosResult.length);
    }
    
    // Upload documents
    const documentFiles = formData.getAll('courseDocuments');
    if (documentFiles.length > 0) {
      const documentsResult = await uploadCourseDocuments(documentFiles, courseId);
      console.log('Documents uploaded:', documentsResult.length);
    }
    
    console.log('All course materials uploaded successfully!');
  } catch (error) {
    console.error('Course upload failed:', error.message);
    throw error;
  }
}

export {
  uploadCourseThumbnail,
  uploadCourseImages,
  uploadCourseVideos,
  uploadCourseDocuments,
  deleteCourseFile,
  generateOptimizedImageUrl,
  generateResponsiveImageUrls,
  createCourseUploadForm,
  handleCourseUpload
};
