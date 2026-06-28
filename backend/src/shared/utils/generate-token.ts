// import jwt from 'jsonwebtoken';

// export const generateToken = (payload: { username: string }): string => {
//   const secret = process.env.JWT_SECRET || 'fallback_secret';
//   // التوكن صالح لمدة يوم كامل
//   return jwt.sign(payload, secret, { expiresIn: '1d' });
// };



import jwt from 'jsonwebtoken';

export const generateToken = (payload: { username: string }): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  }

  // التوكن صالح لمدة يوم كامل
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};