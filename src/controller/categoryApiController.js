import pool from "../configs/connectDB";

let getAllCategories = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `categories`');

    return res.status(200).json({
        message: "success",
        data: rows
    })
}

let createNewCategory = async (req, res) => {
    let {name, description, user_id} = req.body;
   
    if(!name || !description || !user_id) {
        return res.status(200).json({
            message: "required params"
        })
    }

    /** check user_id exists */
    // if(!user_id) {
    //     return res.status(200).json({
    //         message: "user not found"
    //     })
    // } 

    await pool.execute('insert into `categories`(name, description, user_id) values (?, ?, ?)', [name, description, user_id])

    return res.status(200).json({
        message: "create successfully"
    })
}

let updateCategory = async (req, res) => {
    let {name, description, user_id, id} = req.body;

    if(!name || !description || !user_id || !id) {
        return res.status(200).json({
            message: "required params"
        })
    }
    
    await pool.execute('update categories set name = ? , description = ? , user_id = ? where id = ?', [name, description, user_id, id]);
    
    return res.status(200).json({
        message: "update successfully"
    })
}

let getCategory = async (req, res) => {

    let categoryId = req.params.id;
    if(!categoryId) {
        return res.status(200).json({
            message: "required params"
        })
    }

    const [rows, fields] = await pool.execute('SELECT * FROM `categories` where id = ?' , [categoryId]);

    return res.status(200).json({
        message: "success",
        data: rows
    })
}


let deleteCategory = async (req, res) => {
    let categoryId = req.params.id;
    if(!categoryId) {
        return res.status(200).json({
            message: "required id"
        })
    }
    await pool.execute('delete from categories where id = ?', [categoryId]);
    return res.status(200).json({
        message: "delete successfully"
    })
}

module.exports = {
    getAllCategories, createNewCategory, getCategory, updateCategory, deleteCategory
}