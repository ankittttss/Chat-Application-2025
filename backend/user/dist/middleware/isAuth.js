import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: "JWT secret not configured" });
        return;
    }
    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded || !decoded.user) {
            res.status(401).json({ message: "Invalid Token" });
            return;
        }
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid Token"
        });
        return;
    }
};
//# sourceMappingURL=isAuth.js.map