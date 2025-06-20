import express from 'express';
import { usermiddleware } from '../middleware/user.mid.js';
import { confermorder } from '../controller/order.controller.js';
const router = express.Router();
router.post('/order',usermiddleware,confermorder);
export default router;

