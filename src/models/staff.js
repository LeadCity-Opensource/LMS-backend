export default (sequelize, DataTypes) => {
  const Staff = sequelize.define("Staff", {
    staffId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING, // e.g., "Lecturer", "Registrar"
      allowNull: true,
    },
  });

  return Staff;
};
