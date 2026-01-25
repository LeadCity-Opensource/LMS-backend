/**
 * BookTransaction Model
 *
 * Represents borrowing and returning transactions in the Library Management System (LMS).
 * Each record tracks one book copy borrowed by one user.
 *
 * Columns:
 * - id              → primary key
 * - book_id         → foreign key to books table
 * - borrower_id     → foreign key to users table
 * - borrowed_at     → when the book was borrowed (defaults to now)
 * - due_date        → expected return date
 * - returned_at     → when the book was actually returned (null until returned)
 * - status          → current state: borrowed | returned | overdue
 *
 * Associations (to be defined in models/index.js or similar):
 *   BookTransaction.belongsTo(Book,   { foreignKey: 'book_id',   as: 'book' })
 *   BookTransaction.belongsTo(User,   { foreignKey: 'borrower_id', as: 'borrower' })
 *   Book.hasMany(BookTransaction,     { foreignKey: 'book_id',   as: 'transactions' })
 *
 * Author: Hahn Onimus
 * Updated: 25 January 2026
 * books-transactions.js
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const BookTransaction = sequelize.define(
  "BookTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
      onDelete: "RESTRICT", // prevent deletion of book if transactions exist
      onUpdate: "CASCADE",
    },

    borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    borrowed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    returned_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      allowNull: false,
      defaultValue: "borrowed",
    },
  },
  {
    tableName: "book_transactions",
    timestamps: false, // we manage borrowed_at / returned_at manually

    indexes: [
      // Speed up lookups for active borrows by user
      {
        fields: ["borrower_id", "status"],
        where: { status: { [Symbol("in")]: ["borrowed", "overdue"] } },
      },
      // Speed up overdue checks
      {
        fields: ["status", "due_date"],
        where: { status: "borrowed" },
      },
      // Composite index for frequent book availability checks
      {
        fields: ["book_id", "status"],
      },
    ],

    // Optional: hooks (can be useful for future extensions)
    hooks: {
      beforeCreate: (transaction) => {
        //extra validation here if needed
        if (!transaction.due_date) {
          const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
          transaction.due_date = new Date(Date.now() + TWO_WEEKS);
        }
      },
    },
  }
);

export default BookTransaction;