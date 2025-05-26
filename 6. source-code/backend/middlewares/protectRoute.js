import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log(token);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decodes is", decoded);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Token Verification Failed" });
        }

        console.log("decoded", decoded.userId);

        const user = await User.findById(decoded.userId).select("-password");
        console.log(user);


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error on protectRoute", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default protectRoute;