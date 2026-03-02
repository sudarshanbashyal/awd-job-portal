// packages
import fs from "fs";
import path from "path";
import multer from "multer";

// prisma
import { UploadType } from "../../generated/prisma/enums";

export const RESUME_PATH = "src/registry/resume";
export const PROFILE_PATH = "src/registry/profile";
export const OTHER_PATH = "src/registry/other";

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder;
    if (file.mimetype.startsWith("image/")) {
      folder = path.join(process.cwd(), PROFILE_PATH);
    } else if (file.mimetype === "application/pdf") {
      folder = path.join(process.cwd(), RESUME_PATH);
    } else {
      folder = path.join(process.cwd(), OTHER_PATH);
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomUUID() + ext);
  },
});

export const upload = multer({ storage });

export const checkFile = (uploadType: UploadType, fileName: string) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "registry",
      uploadType === UploadType.RESUME ? "resume" : "profile",
      fileName,
    );

    if (!fs.existsSync(filePath)) return null;

    return filePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};
