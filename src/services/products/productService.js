import { Product, ProductStatus } from '../../entities/products/Product.js';
import { Category } from '../../entities/products/Category.js';
import { User, UserRole, PUBLIC_USER_FIELDS } from '../../entities/auth/User.js';
import { escapeRegex } from '../../entities/schemaOptions.js';
import { AppError } from '../../middleware/error/errorHandler.js';

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'price', 'stock', 'views', 'sales', 'rating'];

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  return { [field]: String(sortOrder).toUpperCase() === 'ASC' ? 1 : -1 };
};

const paginate = (page, limit) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.max(parseInt(limit) || 20, 1);
  return { pageNumber, pageSize, skip: (pageNumber - 1) * pageSize };
};

const withRelations = (query) => query
  .populate({ path: 'artisan', select: PUBLIC_USER_FIELDS })
  .populate('category');

export class ProductService {
  async createProduct(productData, artisanId) {
    const { categoryId, ...productInfo } = productData;

    // Verify the owner exists (an artisan, or the admin managing the store)
    const artisan = await User.exists({ _id: artisanId, role: { $in: [UserRole.ARTISAN, UserRole.ADMIN] } });
    if (!artisan) {
      throw new AppError('Artisan not found', 404);
    }

    // Verify category exists
    const category = await Category.exists({ _id: categoryId, isActive: true });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const product = await Product.create({
      ...productInfo,
      artisanId,
      categoryId,
      status: ProductStatus.ACTIVE
    });

    return await withRelations(Product.findById(product._id));
  }

  async getProducts(filters = {}) {
    const {
      page,
      limit,
      categoryId,
      artisanId,
      status = ProductStatus.ACTIVE,
      minPrice,
      maxPrice,
      search,
      sortBy,
      sortOrder
    } = filters;

    const query = { isActive: true };

    if (categoryId) query.categoryId = categoryId;
    if (artisanId) query.artisanId = artisanId;
    if (status) query.status = status;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const pattern = new RegExp(escapeRegex(String(search)), 'i');
      query.$or = [{ name: pattern }, { description: pattern }, { tags: pattern }];
    }

    const { pageNumber, pageSize, skip } = paginate(page, limit);

    const [products, total] = await Promise.all([
      withRelations(Product.find(query).sort(buildSort(sortBy, sortOrder)).skip(skip).limit(pageSize)),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  async getProductById(id) {
    // Increment view count while fetching
    const product = await withRelations(
      Product.findOneAndUpdate({ _id: id, isActive: true }, { $inc: { views: 1 } }, { new: true })
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async assertCanManage(product, userId) {
    if (product.artisanId === userId) return;
    const isAdmin = await User.exists({ _id: userId, role: UserRole.ADMIN });
    if (!isAdmin) {
      throw new AppError('Unauthorized to update this product', 403);
    }
  }

  async updateProduct(id, updateData, userId) {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user is the artisan or admin
    await this.assertCanManage(product, userId);

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

    if (updateData.categoryId && updateData.categoryId !== product.categoryId) {
      const category = await Category.exists({ _id: updateData.categoryId, isActive: true });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
      product.categoryId = updateData.categoryId;
    }

    await product.save();
    return await withRelations(Product.findById(product._id));
  }

  async deleteProduct(id, userId) {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user is the artisan or admin
    await this.assertCanManage(product, userId);

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    return { message: 'Product deleted successfully' };
  }

  async getProductsByArtisan(artisanId, filters = {}) {
    const { page, limit, status, sortBy, sortOrder } = filters;

    const query = { artisanId, isActive: true };
    if (status) query.status = status;

    const { pageNumber, pageSize, skip } = paginate(page, limit);

    const [products, total] = await Promise.all([
      Product.find(query).populate('category').sort(buildSort(sortBy, sortOrder)).skip(skip).limit(pageSize),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  async updateProductRating(productId, rating) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.updateRating(rating);
    return await product.save();
  }

  async listActive(sort, limit) {
    return await withRelations(
      Product.find({ isActive: true, status: ProductStatus.ACTIVE }).sort(sort).limit(limit)
    );
  }

  async getFeaturedProducts(limit = 10) {
    return this.listActive({ rating: -1, sales: -1 }, limit);
  }

  async getPopularProducts(limit = 10) {
    return this.listActive({ views: -1, sales: -1 }, limit);
  }

  async getNewProducts(limit = 10) {
    return this.listActive({ createdAt: -1 }, limit);
  }

  async updateProductStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.stock = Math.max(0, product.stock - quantity);

    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    } else if (product.status === ProductStatus.OUT_OF_STOCK) {
      product.status = ProductStatus.ACTIVE;
    }

    return await product.save();
  }
}
