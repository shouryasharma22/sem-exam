import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import 'dotenv/config';

// Initialize with your cloud name
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME // 'dmquu5ob1'
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // 🌟 THE BULLETPROOF DESIGN: Hardcoded to force an Unsigned asset channel
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      upload_preset: 'sem_exam_preset', // Ensure this matches your Cloudinary preset exactly!
      unsigned: true                    // 👈 Forces Cloudinary to ignore missing/invalid signatures
    });

    try {
      fs.unlinkSync(localFilePath);
    } catch (e) {
      console.warn('Local file cleanup skipped:', e.message);
    }

    return response;
  } catch (error) {
    if (localFilePath) {
      try { fs.unlinkSync(localFilePath); } catch (e) {}
    }
    console.error('Cloudinary Core Error:', error.message || error);
    throw error;
  }
};

export { uploadOnCloudinary };