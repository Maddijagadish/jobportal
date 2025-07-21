import express from "express";
import { register, login, logout , updateProfile, getProfile } from "../controller/user.controller.js";
import { uploadProfileAndResume , profilePicUpload } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", profilePicUpload , register);
router.post("/login", login);
router.post('/logout', logout);
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, uploadProfileAndResume, updateProfile);

export default router;
