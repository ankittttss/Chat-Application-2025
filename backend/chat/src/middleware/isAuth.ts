import type { Request, Response, NextFunction } from 'express';
import Jwt, { type JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

interface IUser extends Document{
    _id:string,
    name:string,
    email:string
}

export interface AuthenticatedRequest extends Request {
    user?: { _id: string; name: string; email: string } | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const decodedValue = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    console.log("decoded:", decodedValue);

    if (!decodedValue) {
    res.status(401).json({ message: "Unauthorized - Invalid payload" });
     return; 
}

    req.user = {
      _id: decodedValue._id as string,
      name: decodedValue.name as string,
      email: decodedValue.email as string,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};




export default isAuth;
