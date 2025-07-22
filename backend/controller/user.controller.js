import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicUrl = req.file?.path || "";

    const newUser = await User.create({
      fullName, email, phoneNumber, password: hashedPassword, role, profilePic: profilePicUrl
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ success: true, message: "User registered successfully.", token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Missing credentials." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.role !== role) return res.status(403).json({ message: "Role mismatch." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password." });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",    
      secure: false,  
      path: "/",    
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    secure: false,
    path: "/",  
  });
  res.status(200).json({ message: "Logged out successfully" });
};



export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const updateFields = { };

    if (fullName) updateFields.fullName = fullName;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (req.files?.profilePic?.[0]) {
      updateFields.profilePic = req.files.profilePic[0].path;
    }
    if (req.user.role === "student" && req.files?.resume?.[0]) {
      updateFields.resume = req.files.resume[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select("-password");
    res.json({ user: updatedUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
