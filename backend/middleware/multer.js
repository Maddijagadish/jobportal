import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "profilePic") {
      return {
        folder: "job_portal_profile_pics",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    } else if (file.fieldname === "resume") {
      return {
        folder: "job_portal_resumes",
        allowed_formats: ["pdf", "doc", "docx"],
      };
    } else {
      throw new Error("Unexpected field: " + file.fieldname);
    }
  },
});

export const profilePicUpload = multer({ storage }).single("profilePic");

export const uploadProfileAndResume = multer({ storage }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
