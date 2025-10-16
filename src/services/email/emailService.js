import nodemailer from 'nodemailer';
import { configs } from '../../config/index.js';

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: configs.email.host,
      port: configs.email.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: configs.email.user,
        pass: configs.email.pass,
      },
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: configs.email.from,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Welcome to IremeCorner!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to IremeCorner!</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for joining IremeCorner! We're excited to have you as part of our community of artisans and craft enthusiasts.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse and purchase handmade crafts</li>
          <li>Enroll in training courses</li>
          <li>Connect with talented artisans</li>
          <li>Share your own creations (if you're an artisan)</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendOrderConfirmationEmail(userEmail, userName, order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Shipping Address</h3>
          <p>${order.shippingAddress}</p>
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendOrderShippedEmail(userEmail, userName, order) {
    const subject = `Your Order Has Shipped - ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'Not available'}</p>
          <p><strong>Shipped Date:</strong> ${new Date(order.shippedAt).toLocaleDateString()}</p>
        </div>

        <p>You can track your package using the tracking number above.</p>
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendCourseEnrollmentEmail(userEmail, userName, course) {
    const subject = `Course Enrollment Confirmation - ${course.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Course Enrollment Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Congratulations! You've successfully enrolled in the course.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Course Details</h3>
          <p><strong>Course Title:</strong> ${course.title}</p>
          <p><strong>Instructor:</strong> ${course.instructor?.getFullName() || 'TBA'}</p>
          <p><strong>Duration:</strong> ${course.getFormattedDuration()}</p>
          <p><strong>Level:</strong> ${course.level}</p>
        </div>

        <p>You can now access your course materials and start learning!</p>
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password for your IremeCorner account.</p>
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendEmailVerificationEmail(userEmail, userName, verificationToken) {
    const subject = 'Verify Your Email Address';
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #28a745;">${verificationUrl}</p>
        
        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendNotificationEmail(userEmail, userName, notification) {
    const subject = notification.title;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${notification.title}</h2>
        <p>Dear ${userName},</p>
        <p>${notification.message}</p>
        
        ${notification.actionUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.actionUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Details</a>
          </div>
        ` : ''}

        <p>Best regards,<br>The IremeCorner Team</p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}


