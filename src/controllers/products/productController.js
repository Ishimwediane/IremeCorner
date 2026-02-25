import { ProductService } from '../../services/products/productService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = asyncHandler(async (req, res) => {
    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      // First image becomes mainImage
      productData.mainImage = `uploads/products/${req.files[0].filename}`;
      
      // All images go into images array
      if (req.files.length > 1) {
        productData.images = req.files.map(file => `uploads/products/${file.filename}`);
      }
    }

    const product = await this.productService.createProduct(productData, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  });

  getProducts = asyncHandler(async (req, res) => {
    const result = await this.productService.getProducts(req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getProductById = asyncHandler(async (req, res) => {
    const product = await this.productService.getProductById(req.params.id);

    res.json({
      success: true,
      data: product
    });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const updateData = { ...req.body };

    // Handle uploaded images on update too
    if (req.files && req.files.length > 0) {
      updateData.mainImage = `uploads/products/${req.files[0].filename}`;
      if (req.files.length > 1) {
        updateData.images = req.files.map(file => `uploads/products/${file.filename}`);
      }
    }

    const product = await this.productService.updateProduct(
      req.params.id,
      updateData,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const result = await this.productService.deleteProduct(req.params.id, req.user.id);

    res.json({
      success: true,
      message: result.message
    });
  });

  getProductsByArtisan = asyncHandler(async (req, res) => {
    const artisanId = req.params.artisanId || req.user.id;
    const result = await this.productService.getProductsByArtisan(artisanId, req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getFeaturedProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const products = await this.productService.getFeaturedProducts(limit);

    res.json({
      success: true,
      data: products
    });
  });

  getPopularProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const products = await this.productService.getPopularProducts(limit);

    res.json({
      success: true,
      data: products
    });
  });

  getNewProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const products = await this.productService.getNewProducts(limit);

    res.json({
      success: true,
      data: products
    });
  });

  updateProductRating = asyncHandler(async (req, res) => {
    const { rating } = req.body;
    const product = await this.productService.updateProductRating(req.params.id, rating);

    res.json({
      success: true,
      message: 'Product rating updated successfully',
      data: product
    });
  });
}