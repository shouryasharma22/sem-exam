import Resource from '../models/resource.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getResources = asyncHandler(async (req, res) => {
  const { department, semester, resourceType, subjectCode, year, examType, search = '' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 12, 1);
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  const normalizedDepartment = department?.toString().trim();
  if (normalizedDepartment) {
    filter.department = { $regex: `^${escapeRegex(normalizedDepartment)}$`, $options: 'i' };
  }

  if (semester) filter.semester = Number(semester);
  if (resourceType) filter.resourceType = resourceType;

  const normalizedSubjectCode = subjectCode?.toString().trim();
  if (normalizedSubjectCode) {
    filter.subjectCode = { $regex: `^${escapeRegex(normalizedSubjectCode)}$`, $options: 'i' };
  }

  if (year) filter.year = Number(year);

  const normalizedExamType = examType?.toString().trim();
  if (normalizedExamType) {
    filter.examType = { $regex: `^${escapeRegex(normalizedExamType)}$`, $options: 'i' };
  }

  if (search && search.trim()) {
    const words = search
      .trim()
      .split(/\s+/)
      .map((word) => escapeRegex(word));

    filter.$and = words.map((word) => {
      const wordRegex = { $regex: word, $options: 'i' };
      return {
        $or: [
          { title: wordRegex },
          { subjectCode: wordRegex },
          { tags: wordRegex }
        ]
      };
    });
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
