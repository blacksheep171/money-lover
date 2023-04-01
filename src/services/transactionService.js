import db from "../models";
const Users = db.users;
const Categories = db.categories;
const Transactions = db.transactions;
const Op = db.Sequelize.Op;
// const { QueryTypes } = require('sequelize');

export const getAll = async () => {
    try{
        const transactions = await Transactions.findAll();
        return {
            message: 'successfully',
            data: transactions
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const getDetails = async (id) => {
    try{
        const categoryData = await Categories.findByPk(id);
        if(categoryData == null){
            return {
                message: 'id not found',
                data: null
            }
        }
        return {
            message: 'successfully',
            data: categoryData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const createTransaction = async ({params}) => {
    let queryParams = {};
    const user = await Users.findByPk(params.user_id);
    if (user == 0) {
        return {
            status: 'user not found',
            data: null
        }
    };

    const category = await Categories.findByPk(params.category_id);
    if (category == 0) {
        return {
            status: 'category not found',
            data: null
        }
    };
    
    try{
         queryParams = {
            transaction_amount:params.transaction_amount,
            note:params.note,
            user_id: Number(params.user_id),
            category_id: Number(params.category_id),
        }
        const transaction = await Transactions.create(queryParams);
        return {
            message: 'create successfully',
            data: transaction
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const update = async ({ id, params }) => {
    let queryParams = {};
    let TransactionData = null;
    try {
        const transactionChecked = await Transactions.findByPk(id);
        if(transactionChecked == 0){
            return {
                message: 'id not found',
                datas: null
            }
        }
        
        const user = await Users.findByPk(params.user_id);

        if(user == null){
            return {
                message: 'user not found',
                data: null
            }
        }

        const category = await Categories.findByPk(params.category_id);

        if (category == null) {
            return {
                message: 'category not found',
                data: null
            }
        };

        queryParams = {
            transaction_amount: params.transaction_amount,
            note: params.note,
            user_id: Number(params.user_id),
            category_id: Number(params.category_id),
        }
        
        const transaction = await Transactions.update(queryParams, {
            where: { id: id }
        });

        if(transaction) {
            TransactionData = await getDetails(id);
        }
        return {
            message: 'update successfully',
            data: TransactionData.data
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const removeTransaction = async ({id}) => {
    try{
        const transaction = await Transactions.findByPk(id);

        if(transaction == null){
            return {
                message: 'id not found',
                data: null
            }
        }
        
        const transactionData = await Transactions.destroy({
            where: { id: id },
        });

        return {
            message: 'delete successfully',
            data: null
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }   
}

export const totalTransaction = async ({userId}) => {
    let total = 0;
    let condition = userId ? { user_id: { [Op.like]: `%${userId}%` } } : null;

    try{   
        const transactions = await Transactions.findAll(
        {
            where: condition
        });
        console.log(">> check transactions", transactions);
        
        if(transactions.length == 0){
            return {
                message: 'user not found',
                data: null
            }
        }
        
        transactions.forEach(result => {
            total += Number(result.transaction_amount);
        });
        return {
            message: 'successfully',
            data: {
                total_transaction: total,
                user_id: userId
            }
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }   
}