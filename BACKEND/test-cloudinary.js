import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

console.log('Using CLOUDINARY_URL:', !!process.env.CLOUDINARY_URL);

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const tmpDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const testFile = path.join(tmpDir, 'test-upload.txt');
fs.writeFileSync(testFile, 'cloudinary test ' + new Date().toISOString());

(async () => {
  try {
    console.log('Uploading test file:', testFile);
    const res = await cloudinary.uploader.upload(testFile, { resource_type: 'auto' });
    console.log('Upload succeeded:', res);
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    try { fs.unlinkSync(testFile); } catch(e){}
  }
})();
