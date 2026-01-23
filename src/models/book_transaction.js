export default (sequelize, DataTypes) => {
  const BookTransaction = sequelize.define(
    "BookTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      borrowerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      borrowedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnedAt: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("borrowed", "returned", "overdue"),
        defaultValue: "borrowed",
      },
    },
    {
      tableName: "book_transactions",
    }
  );

  BookTransaction.associate = (models) => {
    BookTransaction.belongsTo(models.Book, {
      foreignKey: "bookId",
      as: "book",
    });
    BookTransaction.belongsTo(models.User, {
      foreignKey: "borrowerId",
      as: "borrower",
    });
  };

  return BookTransaction;
};
