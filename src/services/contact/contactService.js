import { AppDataSource } from '../../config/database.js';
import { ContactMessage, ContactMessageStatus } from '../../entities/contact/ContactMessage.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class ContactService {
  constructor() {
    this.contactRepository = AppDataSource.getRepository(ContactMessage);
  }

  async createMessage({ name, email, phone, subject, message }) {
    const contactMessage = this.contactRepository.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: ContactMessageStatus.NEW
    });

    return await this.contactRepository.save(contactMessage);
  }

  async getMessages(filters = {}) {
    const { page = 1, limit = 20, status } = filters;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('message')
      .orderBy('message.createdAt', 'DESC');

    if (status) {
      queryBuilder.where('message.status = :status', { status });
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [messages, total] = await queryBuilder.getManyAndCount();

    return {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateStatus(id, status) {
    const contactMessage = await this.contactRepository.findOne({ where: { id } });
    if (!contactMessage) {
      throw new AppError('Message not found', 404);
    }

    contactMessage.status = status;
    return await this.contactRepository.save(contactMessage);
  }

  async deleteMessage(id) {
    const result = await this.contactRepository.delete({ id });
    if (!result.affected) {
      throw new AppError('Message not found', 404);
    }

    return { message: 'Message deleted successfully' };
  }

  async countByStatus(status) {
    return await this.contactRepository.count({ where: { status } });
  }
}
