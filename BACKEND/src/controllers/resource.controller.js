import Resource from '../models/resource.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getResources = asyncHandler(async (req, res) => {
  const { department, semester, resourceType, subjectCode, year, examType, search = '' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 12, 1);
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);
  if (resourceType) filter.resourceType = resourceType;
  if (subjectCode) filter.subjectCode = { $regex: subjectCode.trim(), $options: 'i' };
  if (year) filter.year = Number(year);
  if (examType) filter.examType = examType;

  if (search && search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { subjectCode: searchRegex },
      { tags: searchRegex }
    ];
  }

  const totalResources = await Resource.countDocuments(filter);

  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json(
    new ApiResponse(200, {
      resources,
      page,
      limit,
      total: totalResources,
      hasMore: page * limit < totalResources
    }, 'Resources fetched successfully')
  );
});

const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id).lean();

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  res.status(200).json(
    new ApiResponse(200, resource, 'Resource fetched successfully')
  );
});

export { getResources, getResourceById };
