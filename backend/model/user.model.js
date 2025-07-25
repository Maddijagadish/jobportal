import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String , required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter"], required: true },
  profilePic: { type: String } ,
  resume: { type: String },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);