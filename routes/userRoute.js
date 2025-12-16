import express from "express";
import { 
  loginUser, 
  registerUser, 
  adminLogin, 
  googleLogin 
} from "../controllers/userController.js";

const userRouter = express.Router();

// User registration
userRouter.post("/register", registerUser);

// User login
userRouter.post("/login", loginUser);

// Admin login
userRouter.post("/admin", adminLogin);

// ⭐ Google OAuth login
userRouter.post("/google-login", googleLogin);

export default userRouter;
