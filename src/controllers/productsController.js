import createHttpError from 'http-errors';
import { Product } from '../models/product.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 5, tag, search } = req.query;
    const skip = (page - 1) * perPage;
    let query = Product.find({ userId: req.user._id });
    if (tag) {
      query = query.where('tag').equals(tag);
    }
    if (search) {
      query = query.or([
        {
          name: { $regex: search, $options: 'i' },
        },
        { description: { $regex: search, $options: 'i' } },
      ]);
    }
    const [totalProducts, products] = await Promise.all([
      query.clone().countDocuments(),
      query.skip(skip).limit(perPage),
    ]);
    const totalPages = Math.ceil(totalProducts / perPage);
    console.log('products:', products);
    res.status(200).json({
      page,
      perPage,
      totalProducts,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
    userId: req.user._id,
  });
  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }
  res.status(200).json(product);
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, userId: req.user._id });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      userId: req.user._id,
    },
    req.body,
    { new: true },
  );
  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }
  res.status(200).json(product);
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOneAndDelete({
    _id: productId,
    userId: req.user._id,
  });
  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }
  res.status(200).send(product);
};
