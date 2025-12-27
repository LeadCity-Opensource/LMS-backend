export default (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    "Staff",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // ✅ This is the correct primary key
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      staffId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,     // ✅ Still unique, but not a primary key
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "staff",
      timestamps: false,
    }
  );

  Staff.associate = (models) => {
    Staff.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      as: "user",
    });
  };

  return Staff;
};