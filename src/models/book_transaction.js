export default (sequelize, DataTypes) => {
  const BookTransaction = sequelize.define("BookTransaction", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returned_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      defaultValue: "borrowed",
    },
  }, {
    tableName: "book_transactions",
    timestamps: false,
  });

  BookTransaction.associate = (models) => {
    BookTransaction.belongsTo(models.Book, { foreignKey: "book_id" });
    BookTransaction.belongsTo(models.User, { as: "borrower", foreignKey: "borrower_id" });
  };

  return BookTransaction;
};