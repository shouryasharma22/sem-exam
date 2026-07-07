import { Router } from 'express';
import { getAdminDashboard, uploadResource } from '../controllers/admin.controller.js';
import tokenAuth from '../middlewares/tokenAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.get('/dashboard', tokenAuth, getAdminDashboard);
router.post('/upload', tokenAuth, upload.single('resourceFile'), uploadResource);

export default router;
