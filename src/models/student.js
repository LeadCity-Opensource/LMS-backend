// models/student.model.js
export default (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      matric_no: {
        type: DataTypes.STRING(20),
        primaryKey: true, // matric_no is now the primary key
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true, // ensures a user has only one student record
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      level: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "students",
      timestamps: false,
    }
  );

  // Associations
  Student.associate = (models) => {
    // Link to the User table via user_id
    Student.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      as: "user",
    });
  };

  return Student;
};
