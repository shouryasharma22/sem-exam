import { ApiError } from '../utils/ApiError.js';


export const verifyAdminToken = (req, res, next) => {
  try {
    const adminToken = req.headers['x-admin-token'];

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Missing administrative validation node token.'
      });
    }

    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed. Invalid admin protection sequence token.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server token verification exception fault.'
    });
  }
};


export {verifyAdminToken as default};
