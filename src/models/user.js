const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    // Primary Key
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // User Information
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name cannot be empty" },
        len: [2, 100],
      },
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name cannot be empty" },
        len: [2, 100],
      },
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: "Email already registered",
      },
      validate: {
        isEmail: { msg: "Invalid email format" },
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255],
      },
    },

    // User Role (student, instructor, admin)
    role: {
      type: DataTypes.ENUM("student", "instructor", "admin"),
      defaultValue: "student",
      allowNull: false,
    },

    // Account Status
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
      allowNull: false,
    },

    // Email Verification
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    emailVerificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Password Reset
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    passwordResetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Two-Factor Authentication (Optional)
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    twoFactorSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // Last Login Tracking
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Profile Information (Optional)
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    profilePictureUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Timestamps (automatically managed by Sequelize)
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes
    indexes: [
      {
        fields: ["email"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

// HOOKS - Run code before/after database operations

// Hash password before creating or updating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// INSTANCE METHODS

// Compare password for login
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user data without sensitive fields
User.prototype.toJSON = function () {
  const user = this.get();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.twoFactorSecret;
  return user;
};

// CLASS METHODS

// Find user by email
User.findByEmail = async function (email) {
  return await this.findOne({ where: { email } });
};

// Find active users only
User.findActiveUsers = async function () {
  return await this.findAll({ where: { status: "active" } });
};

module.exports = User;
