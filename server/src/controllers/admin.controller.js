import fs from 'fs';
import Resource from '../models/resource.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAdminDashboard = async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { message: 'Admin dashboard ready' }, 'Admin dashboard loaded successfully')
  );
};

const uploadResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Resource PDF file is required');
  }

  const {
    title,
    department,
    resourceType,
    subjectCode,
    year,
    examType
  } = req.body;

  const isTextbookOrNotes = String(resourceType).trim().toLowerCase() === 'textbook' || String(resourceType).trim().toLowerCase() === 'class notes';

  const errors = [];
  if (!title?.trim()) errors.push('title');
  if (!resourceType?.trim()) errors.push('resourceType');
  if (!subjectCode?.trim()) errors.push('subjectCode');

  if (!isTextbookOrNotes) {
    if (!year || String(year).trim() === '') errors.push('year');
    if (!department?.trim()) errors.push('department');
  }

  if (errors.length > 0) {
    //check if multer created a file at the path and delete it if errors
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    throw new ApiError(400, `Validation Failed. Missing fields: ${errors.join(', ')}`);
  }

  const publicId = `${subjectCode}_${(examType || 'Other')}_${(year || 'NA')}_${Date.now()}`
    .replace(/\s+/g, '_')
    .toUpperCase();

  let uploadedFile;
  try {
    uploadedFile = await uploadOnCloudinary(req.file.path, publicId);
  } catch (err) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('Admin upload cloud storage error:', err);
    const statusCode = err?.http_code || err?.status || 500;
    const errorMessage = err?.message || 'Unknown upstream storage gateway exception';
    throw new ApiError(statusCode, `Failed to upload file to cloud storage: ${errorMessage}`, [errorMessage]);
  }

  if (!uploadedFile?.secure_url) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    throw new ApiError(500, 'Failed to upload file to cloud storage', ['Cloudinary response missing secure_url']);
  }

  const resource = new Resource({
    title: title.trim(),
    department: department.trim(),
    resourceType: resourceType.trim(),
    subjectCode: subjectCode.toString().trim().toUpperCase(),
    year: year !== undefined && year !== null && String(year).trim() !== '' ? Number(year) : undefined,
    examType: examType || 'Other',
    publicId: uploadedFile.public_id,
    fileUrl: uploadedFile.secure_url
  });

  const savedResource = await resource.save();

  if (fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  res.status(201).json(
    new ApiResponse(201, savedResource, 'Resource uploaded successfully')
  );
});

const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await Resource.findById(id);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

let cloudinaryResult = { result: 'not found' };
if (resource.publicId) {
  try {
    cloudinaryResult = await deleteFromCloudinary(resource.publicId);
  } catch (err) {
    const statusCode = err?.http_code || err?.status || 500;
    throw new ApiError(statusCode, `Failed to delete file from cloud storage: ${err?.message || 'Unknown error'}`);
  }
}

if (cloudinaryResult?.result !== 'ok' && cloudinaryResult?.result !== 'not found') {
  throw new ApiError(500, 'Unexpected response from cloud storage during deletion', [cloudinaryResult]);
}

  await Resource.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, { id, cloudinaryStatus: cloudinaryResult?.result }, 'Resource deleted successfully')
  );
});

const verifiedAdminToken = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Administrative token signature verified successfully.'
  });
});



export { getAdminDashboard, uploadResource, deleteResource, verifiedAdminToken };