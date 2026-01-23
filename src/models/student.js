export default (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      matricNumber: {
        type: DataTypes.STRING(20),
        unique: true,
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
    },
    {
      tableName: "students",
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "user",
    });
  };

  return Student;
};
