import express from 'express';
import {createcourse,updatecourse,deletecourse,getcourse,getcoursedetail,buycourse,listpurchases} from '../controller/course.controller.js';
import {usermiddleware} from '../middleware/user.mid.js';   
import { adminmiddleware } from '../middleware/admin.mid.js';
const router = express.Router();

router.post('/create',adminmiddleware, createcourse);
router.post('/update/:courseid',adminmiddleware,updatecourse);
router.delete('/delete/:courseid',adminmiddleware, deletecourse);
router.get('/course', getcourse);
router.get('/:courseid',getcoursedetail);
router.post('/buy/:courseid',usermiddleware,buycourse);
export default router;

