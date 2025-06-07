import jwt from "jsonwebtoken";

/**
 * Generate JWT token and send it in response
 * @param {Object} user - User object
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code
 */
const setCookie = async (user, res, message, statusCode = 200) => {
  // Generate JWT token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: '15h' // 15 hours
  });
  
  // Send token in response body
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user
  });
};

export default setCookie;
