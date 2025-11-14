import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IUser } from "../model/User.js";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ message: "JWT secret not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, secret) as JwtPayload;

    if (!decoded || !decoded.email) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    req.user = {
      name: decoded.name,
      email: decoded.email,
    } as IUser;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
