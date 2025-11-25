import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to verify admin role
export const verifyAdmin = async (req, res, next) => {
  try {
    const User = (await import('../../src/models/User.ts')).default;
    const user = await User.findById(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};
