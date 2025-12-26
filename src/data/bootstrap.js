import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { ROLES } from "../constants/roles.js";
import db from "../models/index.js";

export const initializeAdmin = async () => {
  try {
    const adminExists = await db.User.findOne({ where: { role: ROLES.ADMIN } });

    if (adminExists) {
      console.log("Admin account already exists. Skipping initialization.");
    } else {
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      await db.User.create({
        firstName: "System",
        lastName: "Admin",
        email: env.ADMIN_EMAIL,
        password: hashedPassword,
        role: ROLES.ADMIN,
      });
      console.log(`Initial Admin created: ${env.ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};
