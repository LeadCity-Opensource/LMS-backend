export default (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
    },
    isbn: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    available: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    published_year: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "books",
    timestamps: false,
  });

  return Book;
};