import Users from "./userModel";
import Categories from "./categoryModel";
module.exports = (sequelize, Sequelize) => {
    const Transactions = sequelize.define("transactions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_amount: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING    
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: Users,
            key: "id"
            }
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: Categories,
            key: "id"
            }
        }
        },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
        });
  
    return Transactions;
  };