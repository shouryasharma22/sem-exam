import rateLimit from 'express-rate-limit';

// Restrict repeated requests from a single IP for sensitive endpoints.
export const securityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 requests per IP within the window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      statusCode: options.statusCode,
      message: 'Too many requests. Please try again later.'
    });
  }
});
