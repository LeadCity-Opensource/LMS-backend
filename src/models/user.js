export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

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
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW},},
  {tableName: 'users', timestamps: false

  });
  

  User.associate = (models) => {
    User.hasOne(models.Student, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasOne(models.Staff, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return User;
};
