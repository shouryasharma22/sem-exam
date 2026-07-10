import { Router } from 'express';
import { getAdminDashboard, uploadResource , deleteResource, verifiedAdminToken} from '../controllers/admin.controller.js';
import {verifyAdminToken} from '../middlewares/tokenAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { securityLimiter } from '../middlewares/security.middleware.js';

const router = Router();

router.get('/dashboard', verifyAdminToken, getAdminDashboard);
router.post('/upload', securityLimiter, verifyAdminToken, upload.single('resourceFile'), uploadResource);
router.post('/verify', verifyAdminToken,verifiedAdminToken);
router.delete('/resources/:id', verifyAdminToken, deleteResource);
export default router;
