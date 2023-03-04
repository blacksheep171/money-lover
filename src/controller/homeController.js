import pool from "../configs/connectDB";
import multer from 'multer';

let getHomepage =  async (req, res) => {

        const [rows, fields] = await pool.execute('SELECT * FROM `users`');

        let check = await pool.execute('SELECT * FROM `users`');

        return res.render('index.ejs', {dataUser: rows, title : 'Users Details'});

}

let getDetailPage = async (req, res) => {
    let userId = req.params.id;
    let [user] =  await pool.execute('select * from `users` where id = ?', [userId]);

    return res.send(JSON.stringify(user))
}

let createUser = async (req, res) => {
    let {first_name, last_name, balance, phone, address} = req.body;
    await pool.execute('insert into `users`(first_name, last_name, balance, phone, address) values (?, ?, ?, ?, ?)', [first_name, last_name, balance, phone, address])
    return res.redirect('/');
}

let editUser = async (req, res) => {
    let id = req.params.id;
    let [user] =  await pool.execute('select * from `users` where id = ?', [id]);

    return res.render('update.ejs', {dataUser: user[0]});
}

let updateUser = async (req, res) => {

    let {first_name, last_name, balance, phone, address, id} = req.body;
    await pool.execute('update users set first_name = ? , last_name = ? , balance = ?, phone = ?, address = ? where id = ?', [first_name, last_name, balance, phone, address, id]);
    return res.redirect('/');
}

let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs');
}
 

let deleteUser = async (req, res) => {
    let userId = req.body.userId;
    await pool.execute('delete from users where id = ?', [userId]);
    return res.redirect('/');
}

let handleUploadFile = async (req, res) => {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);
}

let handleUploadMultipleFiles = async (req, res) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }

        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        console.log(">>> check files", files);
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="/images/${files[index].filename}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="/upload">Upload more images</a>';
        res.send(result);
}

module.exports = {
    getHomepage, getDetailPage, createUser, editUser, updateUser, deleteUser, getUploadFilePage, handleUploadFile, handleUploadMultipleFiles
}