import bcrypt from "bcryptjs";
import { ROLES } from "../../constants/roles.js";
import db from "../../models/index.js";
import AppError from "../../utils/AppError.js";

/**
 * Creates new Admin or Staff.
 */
export const createAdminOrStaff = async (req, res, next) => {
  const { email, password, firstName, lastName, role, staffId, designation } =
    req.body || {};

  if (!email || !password || !firstName || !lastName || !role) {
    return next(
      new AppError(
        "Required fields: email, password, firstName, lastName, role",
        400
      )
    );
  }

  const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return next(
      new AppError("This route is for Admin or Staff creation only.", 400)
    );
  }

  // If role is staff, ensure staffId is provided
  if (role === ROLES.STAFF && !staffId) {
    return next(new AppError("Staff ID is required for staff accounts.", 400));
  }

  const t = await db.sequelize.transaction();

  try {
    // Check if user exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return next(new AppError("User with this email already exists", 400));
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

    await t.commit();

    res.status(201).json({
      message: `Account successfully created for ${firstName} ${lastName}`,
      role: newUser.role,
      email: newUser.email,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
