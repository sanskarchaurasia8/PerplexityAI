import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js"; // ❌ verifyEmail removed
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

// Register
authRouter.post("/register", registerValidator, register);

// Login
authRouter.post("/login", loginValidator, login);

// Get current user
authRouter.get("/get-me", authUser, getMe);

export default authRouter;