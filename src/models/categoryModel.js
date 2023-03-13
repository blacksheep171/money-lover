import Users from "./userModel";
module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define("categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT    
        },
        // Add a user_id field to the Category model
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: Users,
            key: "id"
            }
        }
        },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
        });
  
    return Categories;
  };