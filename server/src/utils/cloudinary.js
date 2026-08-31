import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    'Cloudinary configuration failure: Missing core environment credential variables.'
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

const uploadOnCloudinary = async (localFilePath, publicId) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "semexam_resources",
      resource_type: "auto",
      public_id: publicId
    });

    return response;
  } catch (error) {
    console.error('Cloudinary SDK Integration Exception:', JSON.stringify(error, null, 2));
    throw error;
  } finally {
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (cleanupError) {
        console.warn('Local asset clean up skipped:', cleanupError.message);
      }
    }
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return response;
  } catch (error) {
    console.error('Cloudinary delete exception:', JSON.stringify(error, null, 2));
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };