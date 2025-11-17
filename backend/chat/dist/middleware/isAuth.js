import Jwt, {} from 'jsonwebtoken';
import { Document } from 'mongoose';
export const isAuth = async (req, res, next) => {
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
        const decodedValue = Jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded:", decodedValue);
        if (!decodedValue) {
            res.status(401).json({ message: "Unauthorized - Invalid payload" });
            return;
        }
        req.user = {
            _id: decodedValue._id,
            name: decodedValue.name,
            email: decodedValue.email,
        };
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export default isAuth;
//# sourceMappingURL=isAuth.js.map