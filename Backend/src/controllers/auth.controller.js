import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


// ================= REGISTER =================
export async function register(req, res) {

    const { username, email, password } = req.body;

    // ✅ ONLY EMAIL UNIQUE (username duplicate allowed)
    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Email already exists",
            success: false
        });
    }

    // ✅ NO EMAIL VERIFICATION
    const user = await userModel.create({ username, email, password });

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


// ================= LOGIN =================
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { email: email?.toLowerCase?.() },
            { username: email }
        ]
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email/username or password",
            success: false
        });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid password",
            success: false
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // ✅ COOKIE FIX (important for Vercel + Render)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


// ================= GET ME =================
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    });
}