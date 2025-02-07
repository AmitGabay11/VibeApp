import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Ensure token starts with 'Bearer '
        if (token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not defined in environment variables' });
        }

        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Store the decoded user data in the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
