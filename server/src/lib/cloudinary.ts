import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const PROFILE_PRESET = "profile_image";

export const uploadImage = async (base64: string, fileName: string = "") => {
  try {
    const payload = {
      upload_preset: PROFILE_PRESET,
      use_filename: true,
      unique_filename: false,
      filename_override: fileName || undefined,
    };

    const dataUri = `data:image/png;base64,${base64}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      dataUri,
      payload,
    );

    return cloudinaryResponse ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
