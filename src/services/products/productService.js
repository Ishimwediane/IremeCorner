import { AppDataSource } from '../../config/database.js';
import { ProductSchema, ProductStatus } from '../../entities/products/Product.js';
import { CategorySchema } from '../../entities/products/Category.js';
import { UserSchema } from '../../entities/auth/User.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class ProductService {
  constructor() {
    this.productRepository = AppDataSource.getRepository(ProductSchema);
    this.categoryRepository = AppDataSource.getRepository(CategorySchema);
    this.userRepository = AppDataSource.getRepository(UserSchema);
  }

  async createProduct(productData, artisanId) {
    const { categoryId, ...productInfo } = productData;

    // Verify artisan exists
    const artisan = await this.userRepository.findOne({ 
      where: { id: artisanId, role: 'artisan' } 
    });
    if (!artisan) {
      throw new AppError('Artisan not found', 404);
    }

    // Verify category exists
    const category = await this.categoryRepository.findOne({ 
      where: { id: categoryId, type: 'product' } 
    });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const product = this.productRepository.create({
      ...productInfo,
      artisanId,
      categoryId,
      status: ProductStatus.DRAFT
    });

    return await this.productRepository.save(product);
  }

  async getProducts(filters = {}) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      artisanId,
      status = ProductStatus.ACTIVE,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.artisan', 'artisan')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    // Apply filters
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (artisanId) {
      queryBuilder.andWhere('product.artisanId = :artisanId', { artisanId });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tags::text ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id) {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['artisan', 'category']
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Increment view count
    product.views += 1;
    await this.productRepository.save(product);

    return product;
  }

  async updateProduct(id, updateData, userId) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['artisan']
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user is the artisan or admin
    if (product.artisanId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new AppError('Unauthorized to update this product', 403);
      }
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'description', 'price', 'originalPrice', 'stock', 'status',
      'mainImage', 'images', 'tags', 'material', 'dimensions', 'weight',
      'color', 'style', 'specifications', 'careInstructions', 'shippingInfo'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        product[field] = updateData[field];
      }
    });

    return await this.productRepository.save(product);
  }

  async deleteProduct(id, userId) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['artisan']
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user is the artisan or admin
    if (product.artisanId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new AppError('Unauthorized to delete this product', 403);
      }
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await this.productRepository.save(product);

    return { message: 'Product deleted successfully' };
  }

  async getProductsByArtisan(artisanId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.artisanId = :artisanId', { artisanId })
      .andWhere('product.isActive = :isActive', { isActive: true });

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateProductRating(productId, rating) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.updateRating(rating);
    return await this.productRepository.save(product);
  }

  async getFeaturedProducts(limit = 10) {
    return await this.productRepository.find({
      where: { 
        isActive: true, 
        status: ProductStatus.ACTIVE 
      },
      relations: ['artisan', 'category'],
      order: { rating: 'DESC', sales: 'DESC' },
      take: limit
    });
  }

  async getPopularProducts(limit = 10) {
    return await this.productRepository.find({
      where: { 
        isActive: true, 
        status: ProductStatus.ACTIVE 
      },
      relations: ['artisan', 'category'],
      order: { views: 'DESC', sales: 'DESC' },
      take: limit
    });
  }

  async getNewProducts(limit = 10) {
    return await this.productRepository.find({
      where: { 
        isActive: true, 
        status: ProductStatus.ACTIVE 
      },
      relations: ['artisan', 'category'],
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async updateProductStock(productId, quantity) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.stock = Math.max(0, product.stock - quantity);
    
    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    } else if (product.status === ProductStatus.OUT_OF_STOCK) {
      product.status = ProductStatus.ACTIVE;
    }

    return await this.productRepository.save(product);
  }
}


