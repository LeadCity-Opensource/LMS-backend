import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import db from "../../models/index.js";

/**
 * Handles student registration.
 * Uses a managed transaction to ensure both User and Student records are created atomically.
 */
export const signup = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    matricNumber,
    department,
    entryYear,
    programDuration,
    programType,
  } = req.body;

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !matricNumber ||
    !department ||
    !entryYear ||
    !programDuration ||
    !programType
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  // Start a transaction to prevent "orphan" users (User created without a Student profile)
  const t = await db.sequelize.transaction();

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const existingMatric = await db.Student.findOne({
      where: { matricNumber },
    });
    if (existingMatric) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Matric number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create(
      {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: "student",
      },
      { transaction: t }
    );

    await db.Student.create(
      {
        userId: newUser.id,
        matricNumber,
        department,
        entryYear,
        programDuration,
        programType,
      },
      { transaction: t }
    );

    await t.commit(); // If both creations succeed, commit the changes to the database

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      role: newUser.role,
      name: `${newUser.firstName} ${newUser.lastName}`,
      id: newUser.id,
    });
  } catch (error) {
    await t.rollback(); // If any error occurs during the transaction, revert all database changes
    console.error("Signup Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Server error during signup" });
  }
};

/**
 * Authenticates a user and returns a JWT token.
 * Works for all roles (Student, Staff, Admin).
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
    });
  } catch (error) {
    console.log("error logging in:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Updates password for the currently authenticated user.
 */
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // Extracted from the 'protect' middleware token

  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "The old password you entered is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};
