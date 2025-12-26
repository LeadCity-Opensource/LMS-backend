import bcrypt from "bcryptjs";
import { ROLES } from "../../constants/roles.js";
import db from "../../models/index.js";

/**
 * Creates new Admin or Staff.
 */
export const createAdminOrStaff = async (req, res) => {
  const { email, password, firstName, lastName, role, staffId, designation } =
    req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({
      message: "Required fields: email, password, firstName, lastName, role",
    });
  }

  const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res
      .status(400)
      .json({ message: "This route is for Admin or Staff creation only." });
  }

  // If role is staff, ensure staffId is provided
  if (role === ROLES.STAFF && !staffId) {
    return res
      .status(400)
      .json({ message: "Staff ID is required for staff accounts." });
  }

  // Start a transaction to prevent "orphan" users (User created without a Staff profile)
  const t = await db.sequelize.transaction();

  try {
    // Check if user exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User
    const newUser = await db.User.create(
      {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role.toLowerCase(),
      },
      { transaction: t }
    );

    // If Staff, create the Staff Profile
    if (role.toLowerCase() === ROLES.STAFF) {
      await db.Staff.create(
        {
          userId: newUser.id,
          staffId,
          designation,
        },
        { transaction: t }
      );
    }

    await t.commit(); // If all creations succeed, commit the changes to the database

    res.status(201).json({
      message: `Account successfully created for ${firstName} ${lastName}`,
      role: newUser.role,
      email: newUser.email,
    });
  } catch (error) {
    await t.rollback(); // If any error occurs during the transaction, revert all database changes
    console.error("Creation Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
