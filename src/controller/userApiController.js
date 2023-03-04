import pool from "../configs/connectDB";
import path from 'path';

let getAllUsers = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `users`');

    return res.status(200).json({
        message: "success",
        data: rows
    })
}

let createNewUser = async (req, res) => {
    let {first_name, last_name, balance, phone, address} = req.body;
   
    if(!first_name || !last_name || !balance || !phone || !address) {
        return res.status(200).json({
            message: "required params"
        })
    }
    await pool.execute('insert into `users`(first_name, last_name, balance, phone, address) values (?, ?, ?, ?, ?)', [first_name, last_name, balance, phone, address])

    return res.status(200).json({
        message: "create successfully"
    })
}

let updateUser = async (req, res) => {
    let {first_name, last_name, balance, phone, address, id} = req.body;

    if(!first_name || !last_name || !balance || !phone || !address || !id) {
        return res.status(200).json({
            message: "required params"
        })
    }
    
    await pool.execute('update users set first_name = ? , last_name = ? , balance = ?, phone = ?, address = ? where id = ?', [first_name, last_name, balance, phone, address, id]);
    
    return res.status(200).json({
        message: "update successfully"
    })
}

let getUser = async (req, res) => {

    let userId = req.params.id;
    if(!userId) {
        return res.status(200).json({
            message: "required params"
        })
    }

    const [rows, fields] = await pool.execute('SELECT * FROM `users` where id = ?' , [userId]);

    return res.status(200).json({
        message: "success",
        data: rows
    })
}

let deleteUser = async (req, res) => {
    let userId = req.params.id;
    if(!userId) {
        return res.status(200).json({
            message: "required id"
        })
    }
    await pool.execute('delete from users where id = ?', [userId]);
    return res.status(200).json({
        message: "delete successfully"
    })
}


let handleUploadFile = async (req, res) => {
    let userId = req.params.id;
        if(!userId) {
            return res.status(200).json({
                message: "required id"
            })
        }

    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.status(200).json({
            message: 'Please select an image to upload'
        })
    }
    // let image = path.join(__dirname,req.file.filename);
    let image = req.file.filename;
    console.log(">>> avatar:", image);
    // Display uploaded image for user validation
    await pool.execute('update users set image = ? where id = ?', [image, userId]);
    return res.status(200).json({
        message: 'You have uploaded this image'
    })

}


module.exports = {
    getAllUsers, createNewUser, updateUser, getUser, deleteUser, handleUploadFile
}