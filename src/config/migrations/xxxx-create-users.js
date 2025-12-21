module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      user_type: {
        type: Sequelize.ENUM("student", "admin_staff", "regular_staff"),
        allowNull: false,
      },

      matric_no: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "students",
          key: "matric_no",
        },
      },

      staff_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      date_created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
