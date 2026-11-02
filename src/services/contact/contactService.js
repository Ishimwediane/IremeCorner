import { ContactMessage, ContactMessageStatus } from '../../entities/contact/ContactMessage.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class ContactService {
  async createMessage({ name, email, phone, subject, message }) {
    return await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: ContactMessageStatus.NEW
    });
  }

  async getMessages(filters = {}) {
    const pageNumber = Math.max(parseInt(filters.page) || 1, 1);
    const pageSize = Math.max(parseInt(filters.limit) || 20, 1);
    const query = filters.status ? { status: filters.status } : {};

    const [messages, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
      ContactMessage.countDocuments(query)
    ]);

    return {
      messages,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  async updateStatus(id, status) {
    const contactMessage = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
    if (!contactMessage) {
      throw new AppError('Message not found', 404);
    }

    return contactMessage;
  }

  async deleteMessage(id) {
    const result = await ContactMessage.deleteOne({ _id: id });
    if (!result.deletedCount) {
      throw new AppError('Message not found', 404);
    }

    return { message: 'Message deleted successfully' };
  }

  async countByStatus(status) {
    return await ContactMessage.countDocuments({ status });
  }
}
