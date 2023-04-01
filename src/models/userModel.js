module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
      ,first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      balance: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      access_token: {
        type: Sequelize.STRING,
        unique: true
      },
      refresh_token: {
        type: Sequelize.STRING,
        unique: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        unique: true,
        default: false
      }
    },{
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return Users;
  };