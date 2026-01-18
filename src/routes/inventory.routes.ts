import { Router } from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock
} from '../controllers/inventory.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/stock-bajo', getLowStock);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
