export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("admin", "staff", "student"),
      allowNull: false,
      defaultValue: "student",
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Student, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasOne(models.Staff, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return User;
};
