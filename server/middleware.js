import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token)
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide.' });
    console.log('Payload du token :', user);
    req.user = user;
    next();
  });
}
