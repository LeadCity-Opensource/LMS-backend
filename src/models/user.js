export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    },
    { tableName: "users" }
  );

  User.associate = (models) => {
    User.hasOne(models.Student, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "student",
    });
    User.hasOne(models.Staff, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "staff",
    });
  };

  return User;
};
