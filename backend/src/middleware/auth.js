import { verifyToken, extractToken } from '../utils/authUtils.js';
import User from '../models/User.js';

// Authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const existingUser = await User.findById(decoded.id);

    if (!existingUser) {
      return res.status(401).json({ error: 'Invalid token user' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
