import express from 'express';
import { signup,login,logout, updateUser} from '../controller/user.controller.js';
import {usermiddleware} from '../middleware/user.mid.js';
import {listpurchases} from '../controller/course.controller.js';
const router = express.Router();

router.post('/signup',signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/purchases',usermiddleware,listpurchases);
router.post('/update/:id',usermiddleware,updateUser);

export default router;

