import express from "express";
import {
  checkAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../../controllers/authControllers/auth.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes (require valid cookie)
router.get("/check", verifyAuth, checkAuth);
router.post("/logout", verifyAuth, logoutUser);

export default router;
