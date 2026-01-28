export default (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    "Staff",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      staffId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "staff",
    }
  );

  Staff.associate = (models) => {
    Staff.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "user",
    });
  };

  return Staff;
};
