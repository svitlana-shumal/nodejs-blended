import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  createProductSchema,
  getAllProductsSchema,
  productIdSchema,
  updateProductSchema,
} from '../validations/productsValidation.js';

const router = Router();

router.use('/products', authenticate);
router.get('/products', celebrate(getAllProductsSchema), getAllProducts);

router.get('/products/:productId', celebrate(productIdSchema), getProductById);
router.post('/products', celebrate(createProductSchema), createProduct);
router.patch(
  '/products/productId',
  celebrate(updateProductSchema),
  updateProduct,
);
router.delete(
  '/products/:productId',
  celebrate(productIdSchema),
  deleteProduct,
);

export default router;
