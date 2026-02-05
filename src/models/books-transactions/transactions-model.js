/**
 * BookTransaction Model
 *
 * This module defines the `BookTransaction` Sequelize model for the LMS backend.
 * Each transaction represents the borrowing and returning of a book by a user.
 *
 * Columns:
 * - id: primary key, auto-increment
 * - book_id: the book being borrowed
 * - borrower_id: the user borrowing the book
 * - borrowed_at: timestamp when borrowed (default now)
 * - due_date: when the book is due
 * - returned_at: timestamp when returned
 * - status: enum("borrowed", "returned", "overdue")
 *
 * Advanced logic handled elsewhere:
 * - Automatic overdue checks
 * - Validation to prevent double borrowing
 *
 * Author: Hahn Onimus
 * Date: 08-01-2026
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

// Define BookTransaction table mapping
export const BookTransaction = sequelize.define(
  "BookTransaction",
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Foreign key: book being borrowed
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Foreign key: user borrowing the book
    borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Timestamp when book is borrowed; default is now
    borrowed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    // Due date for returning the book
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    // Timestamp when book was returned
    returned_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Current transaction status
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      allowNull: false,
      defaultValue: "borrowed",
    },
  },
  {
    tableName: "book_transactions",
    timestamps: false, // Sequelize won't add createdAt/updatedAt
  }
);
