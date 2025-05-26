import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // now you have req.user._id

        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
