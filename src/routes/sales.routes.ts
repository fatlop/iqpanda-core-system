import { Router } from 'express';
import {
  getAllSales,
  getSale,
  createSale,
  cancelSale
} from '../controllers/sales.controller';

const router = Router();

router.get('/', getAllSales);
router.get('/:id', getSale);
router.post('/', createSale);
router.put('/:id/cancelar', cancelSale);

export default router;
