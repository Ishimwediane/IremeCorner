# Cloudinary Integration for IremeCorner

## Overview

IremeCorner uses Cloudinary for all file uploads, providing automatic optimization, transformation, and CDN delivery for images, videos, and documents.

## Features

- **Automatic Optimization**: Images and videos are automatically optimized for web delivery
- **Responsive Images**: Automatic format selection (WebP, AVIF) and quality optimization
- **Video Processing**: Automatic video optimization and format conversion
- **CDN Delivery**: Fast global content delivery
- **Organized Storage**: Files are organized by type and entity (courses, products, users)
- **Transformations**: Automatic resizing and cropping for different use cases

## Configuration

### Environment Variables

```env
CLOUDINARY_CLOUD_NAME=dfe7ue90j
CLOUDINARY_API_KEY=623865115459183
CLOUDINARY_API_SECRET=MPsMGN6Fc97CXafJSwrOg_Dwvj0
```

### Folder Structure

Cloudinary organizes files in the following structure:

```
iremecorner/
├── courses/
│   ├── {courseId}/
│   │   ├── thumbnail.jpg
│   │   ├── images/
│   │   ├── videos/
│   │   └── documents/
├── products/
│   └── {productId}/
├── users/
│   └── {userId}/
└── temp/
```

## API Endpoints

### Course File Uploads

#### Upload Course Thumbnail
```http
POST /api/courses
Content-Type: multipart/form-data
Authorization: Bearer <token>

courseThumbnail: <file>
title: "Course Title"
description: "Course Description"
...
```

#### Upload Course Images
```http
POST /api/courses/:id/images
Content-Type: multipart/form-data
Authorization: Bearer <token>

courseImages: <file1>, <file2>, <file3>
```

**Response:**
```json
{
  "success": true,
  "message": "Course images uploaded successfully",
  "data": [
    {
      "publicId": "iremecorner/courses/123/images/image1",
      "url": "https://res.cloudinary.com/dfe7ue90j/image/upload/v1234567890/iremecorner/courses/123/images/image1.jpg",
      "width": 1200,
      "height": 800,
      "format": "jpg",
      "bytes": 245760
    }
  ]
}
```

#### Upload Course Videos
```http
POST /api/courses/:id/videos
Content-Type: multipart/form-data
Authorization: Bearer <token>

courseVideos: <file1>, <file2>
```

**Response:**
```json
{
  "success": true,
  "message": "Course videos uploaded successfully",
  "data": [
    {
      "publicId": "iremecorner/courses/123/videos/video1",
      "url": "https://res.cloudinary.com/dfe7ue90j/video/upload/v1234567890/iremecorner/courses/123/videos/video1.mp4",
      "duration": 120.5,
      "format": "mp4",
      "bytes": 15728640
    }
  ]
}
```

#### Upload Course Documents
```http
POST /api/courses/:id/documents
Content-Type: multipart/form-data
Authorization: Bearer <token>

courseDocuments: <file1>, <file2>
```

**Response:**
```json
{
  "success": true,
  "message": "Course documents uploaded successfully",
  "data": [
    {
      "publicId": "iremecorner/courses/123/documents/doc1",
      "url": "https://res.cloudinary.com/dfe7ue90j/raw/upload/v1234567890/iremecorner/courses/123/documents/doc1.pdf",
      "format": "pdf",
      "bytes": 1024000
    }
  ]
}
```

#### Delete Course File
```http
DELETE /api/courses/files/:publicId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "result": "ok"
  }
}
```

## File Types Supported

### Images
- **Formats**: JPEG, PNG, GIF, WebP
- **Max Size**: 10MB
- **Transformations**: Automatic resizing, quality optimization, format conversion
- **Use Cases**: Course thumbnails, course images, product images, user avatars

### Videos
- **Formats**: MP4, AVI, MOV, QuickTime
- **Max Size**: 100MB
- **Transformations**: Automatic optimization, format conversion
- **Use Cases**: Course videos, product demonstrations

### Documents
- **Formats**: PDF, DOC, DOCX, XLS, XLSX, TXT
- **Max Size**: 10MB
- **Use Cases**: Course materials, product specifications, user documents

## Automatic Transformations

### Course Thumbnails
- **Size**: 800x600 pixels
- **Crop**: Fill with center gravity
- **Quality**: Auto optimization
- **Format**: Auto selection (WebP, AVIF)

### Course Images
- **Size**: 1200x800 pixels
- **Crop**: Fill with center gravity
- **Quality**: Auto optimization
- **Format**: Auto selection

### Product Images
- **Size**: 1000x1000 pixels
- **Crop**: Fill with center gravity
- **Quality**: Auto optimization
- **Format**: Auto selection

### User Avatars
- **Size**: 300x300 pixels
- **Crop**: Fill with face gravity
- **Quality**: Auto optimization
- **Format**: Auto selection

## Usage Examples

### Frontend Integration

```javascript
// Upload course thumbnail
const formData = new FormData();
formData.append('courseThumbnail', file);
formData.append('title', 'My Course');
formData.append('description', 'Course description');

const response = await fetch('/api/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Upload multiple course images
const formData = new FormData();
files.forEach(file => {
  formData.append('courseImages', file);
});

const response = await fetch(`/api/courses/${courseId}/images`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Displaying Images

```html
<!-- Course thumbnail with automatic optimization -->
<img src="https://res.cloudinary.com/dfe7ue90j/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/iremecorner/courses/123/thumbnail.jpg" 
     alt="Course Thumbnail">

<!-- Responsive image with multiple sizes -->
<img src="https://res.cloudinary.com/dfe7ue90j/image/upload/w_400,h_300,c_fill,g_center,q_auto,f_auto/iremecorner/courses/123/image1.jpg" 
     srcset="https://res.cloudinary.com/dfe7ue90j/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/iremecorner/courses/123/image1.jpg 2x"
     alt="Course Image">
```

## Benefits

- **Performance**: Automatic optimization reduces file sizes by up to 80%
- **Speed**: CDN delivery ensures fast loading worldwide
- **Quality**: Automatic format selection provides best quality/size ratio
- **Scalability**: Handles high traffic and large file volumes
- **Cost-Effective**: Pay only for what you use
- **Reliability**: 99.9% uptime guarantee

## Security

- **Access Control**: Only authenticated users can upload files
- **File Validation**: Server-side validation of file types and sizes
- **Virus Scanning**: Automatic virus scanning for uploaded files
- **Secure URLs**: Time-limited URLs for sensitive content

## Monitoring

- **Usage Analytics**: Track bandwidth and storage usage
- **Performance Metrics**: Monitor loading times and optimization rates
- **Error Tracking**: Automatic error reporting and debugging
- **Cost Monitoring**: Track costs and usage patterns

## Best Practices

1. **Use Appropriate Sizes**: Upload high-resolution images, let Cloudinary optimize
2. **Organize Files**: Use consistent folder structures
3. **Optimize for Web**: Use automatic quality and format optimization
4. **Monitor Usage**: Keep track of bandwidth and storage costs
5. **Clean Up**: Regularly delete unused files to save costs
6. **Use Transformations**: Leverage Cloudinary's transformation API for different use cases






