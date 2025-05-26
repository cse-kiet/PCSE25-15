import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const JWT_SECRET = process.env.JWT_SECRET || "58BQgyvWqGt8rP5mQWXtPBXLmLeJ/lJtLXTuQab7BaI=";
    console.log(JWT_SECRET);
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', token, {
        httpOnly: true, // to prevent XSS attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
    })
}

export default generateTokenAndSetCookie;