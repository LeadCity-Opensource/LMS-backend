module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_type: {
        type: DataTypes.ENUM('student', 'admin_staff', 'regular_staff'),
        allowNull: false,
      },

      // FK → STUDENTS.matric_no (students only)
      matric_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // FK → STAFF_REGULAR.staff_id OR LIBRARY_STAFF_ADMIN.staff_id
      staff_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );

  User.associate = (models) => {
    // Student relationship
    User.belongsTo(models.Students, {
      foreignKey: 'matric_no',
      targetKey: 'matric_no',
    });

    // Regular staff relationship
    User.belongsTo(models.StaffRegular, {
      foreignKey: 'staff_id',
      targetKey: 'staff_id',
    });

    // Admin staff relationship
    User.belongsTo(models.LibraryStaffAdmin, {
      foreignKey: 'staff_id',
      targetKey: 'staff_id',
    });
  };

  return User;
};
