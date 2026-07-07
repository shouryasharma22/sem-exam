import { ApiError } from '../utils/ApiError.js';

const tokenAuth = (req, res, next) => {
  const providedToken = req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '');

  if (!providedToken || providedToken !== process.env.ADMIN_TOKEN) {
    return next(new ApiError(401, 'Unauthorized access'));
  }

  next();
};

export default tokenAuth;
