import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import db from "../../models/index.js";
import AppError from "../../utils/AppError.js";

/**
 * Handles student registration.
 */
export const signup = async (req, res, next) => {
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
    return next(new AppError("All required fields must be provided.", 400));
  }

  const t = await db.sequelize.transaction();

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return next(new AppError("User with this email already exists", 400));
    }

    const existingMatric = await db.Student.findOne({
      where: { matricNumber },
    });
    if (existingMatric) {
      await t.rollback();
      return next(new AppError("Matric number already registered", 400));
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

    await t.commit();

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
    await t.rollback();
    next(error);
  }
};

/**
 * Authenticates a user and returns a JWT token.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
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
    next(error);
  }
};

/**
 * Updates password for the currently authenticated user.
 */
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    if (!oldPassword || !newPassword) {
      return next(new AppError("Both old and new passwords are required", 400));
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(
        new AppError("The old password you entered is incorrect", 401)
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
