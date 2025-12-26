export default (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    matricNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entryYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    programDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    programType: {
      type: DataTypes.ENUM("Undergraduate", "Postgraduate"),
      allowNull: false,
    },
  });

  return Student;
};
