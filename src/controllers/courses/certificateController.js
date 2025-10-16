import { CertificateService } from '../../services/courses/certificateService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class CertificateController {
  constructor() {
    this.certificateService = new CertificateService();
  }

  // Get user's certificates
  getMyCertificates = asyncHandler(async (req, res) => {
    const certificates = await this.certificateService.getUserCertificates(req.user.id);

    res.json({
      success: true,
      data: certificates
    });
  });

  // Get certificate by ID
  getCertificateById = asyncHandler(async (req, res) => {
    const certificate = await this.certificateService.getCertificateById(req.params.certificateId);

    res.json({
      success: true,
      data: certificate
    });
  });

  // Verify certificate
  verifyCertificate = asyncHandler(async (req, res) => {
    const { certificateNumber, verificationCode } = req.body;
    const verification = await this.certificateService.verifyCertificate(
      certificateNumber,
      verificationCode
    );

    res.json({
      success: true,
      data: verification
    });
  });

  // Issue certificate (Admin only)
  issueCertificate = asyncHandler(async (req, res) => {
    const { studentId, courseId } = req.body;
    const certificate = await this.certificateService.issueCertificate(studentId, courseId);

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: certificate
    });
  });

  // Revoke certificate (Admin only)
  revokeCertificate = asyncHandler(async (req, res) => {
    const certificate = await this.certificateService.revokeCertificate(req.params.certificateId);

    res.json({
      success: true,
      message: 'Certificate revoked successfully',
      data: certificate
    });
  });

  // Get course certificates (Trainer/Admin only)
  getCourseCertificates = asyncHandler(async (req, res) => {
    const certificates = await this.certificateService.getCourseCertificates(
      req.params.courseId,
      req.user
    );

    res.json({
      success: true,
      data: certificates
    });
  });

  // Download certificate (PDF generation)
  downloadCertificate = asyncHandler(async (req, res) => {
    const certificate = await this.certificateService.getCertificateById(req.params.certificateId);
    
    // In a real implementation, you would generate a PDF here
    // For now, we'll return the certificate data
    res.json({
      success: true,
      message: 'Certificate download initiated',
      data: {
        certificate,
        downloadUrl: `/api/certificates/${certificate.id}/pdf`
      }
    });
  });
}




