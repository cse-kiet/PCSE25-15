import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        console.log(req.body);
        const { fullName, username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password do not match" })
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "This username already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
        });

        if (newUser) {
            //generate JWT token here    
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }


    } catch (error) {
        console.log("Error on signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username
        });

        const isPasswordCorrect = user && await bcrypt.compare(password, user.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //generate JWT token here
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
        });

    } catch (error) {
        console.log("Error on login", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (_, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error on logout", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

