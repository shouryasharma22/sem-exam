import Resource from '../models/resource.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
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
  if (requiredFields.some((field) => field === undefined || field === null || field === '')) {
    throw new ApiError(400, 'All required metadata fields must be provided');
  }

  const uploadedFile = await uploadOnCloudinary(req.file.path);

  if (!uploadedFile?.secure_url) {
    throw new ApiError(500, 'Failed to upload file to cloud storage');
  }

  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => tag.trim()).filter(Boolean)
    : typeof tags === 'string'
      ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const resource = new Resource({
    title,
    department,
    semester: Number(semester),
    resourceType,
    subjectCode: subjectCode.toString().toUpperCase(),
    year: Number(year),
    examType: examType || 'Other',
    fileUrl: uploadedFile.secure_url,
    tags: normalizedTags,
    isActive: true
  });

  const savedResource = await resource.save();

  res.status(201).json(
    new ApiResponse(201, savedResource, 'Resource uploaded successfully')
  );
});

export { getAdminDashboard, uploadResource };
