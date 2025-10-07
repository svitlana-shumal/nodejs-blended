import { Product } from '../models/product.js';

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

export default getAllProducts;
