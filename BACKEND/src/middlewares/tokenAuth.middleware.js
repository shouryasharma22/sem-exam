import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to intercept requests and enforce admin token validation checkpoints.
 */
export const verifyAdminToken = (req, res, next) => {
  try {
    // Extracts the custom token header sent from the frontend input field
    const adminToken = req.headers['x-admin-token'];

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Missing administrative validation node token.'
      });
    }

    // Security check against your hidden server environment token parameter
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed. Invalid admin protection sequence token.'
      });
    }

    // Handshake successful—proceed to the next route controller (e.g., your upload pipe)
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server token verification exception fault.'
    });
  }
};


export {verifyAdminToken as default};
