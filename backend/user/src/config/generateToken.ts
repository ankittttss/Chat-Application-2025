import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { IUser } from "../model/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT secret is not defined in environment variables");
}

export interface UserPayload {
  id:string,
  name: string;
  email: string;
}

export const generateToken = (user:UserPayload): string => {
  const token = Jwt.sign(
    { id:user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" } 
  );
  return token;
};
