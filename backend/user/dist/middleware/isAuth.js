import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
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
        const decoded = jwt.verify(token, secret);
        if (!decoded || !decoded.email) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        req.user = {
            name: decoded.name,
            email: decoded.email,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=isAuth.js.map