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
    semester,
    resourceType,
    subjectCode,
    year,
    examType,
    tags
  } = req.body;

  const requiredFields = [title, department, semester, resourceType, subjectCode, year];
  if (requiredFields.some((field) => field === undefined || field === null || String(field).trim() === '')) {
    throw new ApiError(400, 'All required metadata fields must be provided');
  }

  const publicId = `${subjectCode}_${examType || 'Other'}_${year}_${Date.now()}`
    .replace(/\s+/g, '_')
    .toUpperCase();

  let uploadedFile;
  try {
    uploadedFile = await uploadOnCloudinary(req.file.path, publicId);
  } catch (err) {
    console.error('Admin upload cloud storage error:', err);
    const statusCode = err?.http_code || err?.status || 500;
    const errorMessage = err?.message || 'Unknown upstream storage gateway exception';
    throw new ApiError(statusCode, `Failed to upload file to cloud storage: ${errorMessage}`, [errorMessage]);
  }

  if (!uploadedFile?.secure_url) {
    throw new ApiError(500, 'Failed to upload file to cloud storage', ['Cloudinary response missing secure_url']);
  }

  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => tag.trim()).filter(Boolean)
    : typeof tags === 'string'
      ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const resource = new Resource({
    title: title.trim(),
    department: department.trim(),
    semester: Number(semester),
    resourceType: resourceType.trim(),
    subjectCode: subjectCode.toString().trim().toUpperCase(),
    year: Number(year),
    examType: examType || 'Other',
    publicId: uploadedFile.public_id,
    fileUrl: uploadedFile.secure_url,
    tags: normalizedTags,
    isActive: true
  });

  const savedResource = await resource.save();

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