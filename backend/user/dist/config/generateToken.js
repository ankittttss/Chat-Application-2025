import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT secret is not defined in environment variables");
}
export const generateToken = (user) => {
    const token = Jwt.sign({ _id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    return token;
};
//# sourceMappingURL=generateToken.js.map