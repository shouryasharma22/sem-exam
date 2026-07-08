import { Router } from 'express';
import { getAdminDashboard, uploadResource } from '../controllers/admin.controller.js';
import {verifyAdminToken} from '../middlewares/tokenAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.get('/dashboard', verifyAdminToken, getAdminDashboard);
router.post('/upload', verifyAdminToken, upload.single('resourceFile'), uploadResource);
router.post('/verify', verifyAdminToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Administrative token cluster node signature verified successfully.'
  });
});

export default router;
