import express from 'express';
import { uploadResource } from '../controllers/admin.controller.js';
import { getResources, getResourceById } from '../controllers/resource.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/', getResources);
router.post('/', upload.single('resourceFile'), uploadResource);
router.get('/:id', getResourceById);

export default router;
