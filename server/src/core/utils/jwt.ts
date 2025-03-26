import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signToken = (payload: object) => 
  jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });

export const verifyToken = (token: string) => 
  jwt.verify(token, JWT_SECRET);