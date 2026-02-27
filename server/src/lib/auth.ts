// libraries
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// types
import { User } from "generated/prisma/browser";

export const encryptPassword = async (pw: string) => {
  try {
    return await bcrypt.hash(pw, 10);
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (pw: string, hash: string) => {
  try {
    return await bcrypt.compare(pw, hash);
  } catch (error) {
    throw error;
  }
};

export const generateAccessToken = (user: User) => {
  try {
    return jwt.sign(
      { email: user.email, role: user.role },
      process.env.AUTH_KEY!,
      {
        algorithm: "HS256",
        expiresIn: "3h",
      },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
