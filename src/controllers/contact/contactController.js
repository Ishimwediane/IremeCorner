import { ContactService } from '../../services/contact/contactService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class ContactController {
  constructor() {
    this.contactService = new ContactService();
  }

  createMessage = asyncHandler(async (req, res) => {
    await this.contactService.createMessage(req.body);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
  });

  getMessages = asyncHandler(async (req, res) => {
    const result = await this.contactService.getMessages(req.query);

    res.json({
      success: true,
      data: result
    });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const contactMessage = await this.contactService.updateStatus(req.params.id, req.body.status);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: contactMessage
    });
  });

  deleteMessage = asyncHandler(async (req, res) => {
    const result = await this.contactService.deleteMessage(req.params.id);

    res.json({
      success: true,
      message: result.message
    });
  });
}
