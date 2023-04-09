import db from "../models";
import bcrypt from 'bcrypt';
import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';
// import { Buffer } from "buffer";
// import { fs } from "fs";
var appRoot = require('app-root-path');
var fs = require('fs');
var mime = require ('mime');
const Users = db.users;

export const getAllUsers = async () => {
    try{
        const userData = await Users.findAll();
        return {
            message: 'success',
            data: userData
        }
    }catch(e){
        return {
            message: e,
            data: null
        }
    }
}

export const registerUser = async ({params}) => {
    let queryParams = {};
    const hashPassword = bcrypt.hashSync(params.password, 10);
    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(params.email);
  if (!isEmail) {
    return {
        message: 'email not found',
        data: null
    }
  } else {
    const isCheckEmail = await Users.findOne({ where: { email: params.email } });
    if (isCheckEmail) {
      return {
        message: 'email already exist',
        data: null
      }
    }
  }
    try{
         queryParams = {
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            password: hashPassword,
            balance: params.balance,
            phone: params.phone,
            address: params.address,
        }
        const userData = await Users.create(queryParams);
        return {
            message: 'create successfully',
            data: userData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const generalAcessToken = (data) => {
  let key = process.env.SECRET_KEY;
  const access_token = jwt.sign(data, key, { expiresIn: '1h' });
  console.log(">>> check access token: ", access_token);
  return access_token
}

export const generalRefreshToken = (data) => {
  const access_token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '365d' })
  return access_token
}
export const loginUser = async ({params}) => {
    
    try{
        const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(params.email);
        if (!isEmail) {
            return {
                status: 'email does not exist',
                data: null
            }
        } else {
            let userData = await Users.findOne({ where: { email: params.email } });
            if (!userData) {
                return {
                    status: 'user not found',
                    data: null
                }
            }
            const checkPassword = bcrypt.compareSync(params.password, userData.password);
            if (!checkPassword) {
                return {
                    status: 'wrong password',
                    data: null
                }
            }
            let payload = { id: userData.id, email: userData.email, isAdmin: userData.isAdmin }
            const access_token = generalAcessToken(payload);
            
            return {
                message: 'login successfully',
                data : {
                    users: payload,
                    token: access_token
                }

            }
        }
    }catch(e){
        console.log(e);
        return {
            status: 'error',
            data: null
        }
    }   
  
}

export const getDetails = async (id) => {
    try{
        const userData = await Users.findByPk(id);
        if(!userData){
            return {
                message: 'id not found',
                data: userData
            }
        } else return {
            message: 'success',
            data: userData
        }
    }catch(e){
        console.log(e);
        return {
            message: 'error',
            data: null
        }
    }
}

export const createUser = async ({params}) => {
    let queryParams = {};
    const hashPassword = bcrypt.hashSync(params.password, 10);
    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(params.email);
    if (!isEmail) {
        return {
            message: 'email not found',
            data: null
        }
    } else {
        const isCheckEmail = await Users.findOne({ where: { email: params.email } });
        if (isCheckEmail) {
            return {
                message: 'email already exist',
                data: null
            }
        }
    }
    try{
         queryParams = {
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            password: hashPassword,
            balance: params.balance,
            phone: params.phone,
            address: params.address,
        }
        const userData = await Users.create(queryParams);
        return {
            message: 'create successfully',
            data: userData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const updateUser = async ({ userId, params }) => {
    let queryParams = {};
    let userData = null;
    try {
        const checkUser = await Users.findByPk(userId);
        if(checkUser == 0){
            return {
                message: 'id not found',
                data: null
            }
        }

        const isCheckEmail = await Users.findOne({ where: { email: params.email } });
        if (checkUser.email != params.email && isCheckEmail) {
            return {
                message: 'email already exist',
                data: null
            }
        }

        queryParams = {
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            balance: params.balance,
            phone: params.phone,
            address: params.address
        }
        const user =  await Users.update(queryParams,{
            where: { id: userId }
        });
        if(!user) {
            return {
                message: 'update failed, please try later',
                data: null
            }
        }
            userData = await getDetails(userId);
        return {
            message: 'update successfully',
            data: userData.data
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const removeUser = async ({userId}) => {
    try{
        const checkUser = await Users.findByPk(userId);

        if(checkUser == null){
            return {
                message: 'id not found',
                data: null
            }
        }

        const userData = await Users.destroy({
            where: { id: userId },
        });

        return {
            message: 'delete successfully',
            data: null
        }
    }catch(e){
        console.log(e);
        return {
            data: null
        }
    }   
}

export const handleUploadImage = async ({userId, image}) => {
    let userData = null;
    try {
        const checkUser = await Users.findByPk(userId);
        if(checkUser == 0){
            return {
                message: 'id not found',
                data: null
            }
        }
        const user = await Users.update({
            image: image 
        }, {
            where: {id : userId}
        }) 
        if(user) {
            userData = await getDetails(userId);
        }
        return {
            message: 'upload successfully',
            data: userData
        }

    }catch(e){
        console.log(e);
        return {
            users: null
        }
    }  
}


export const handleUploadBase64 = async ({userId, image}) => {
    let userData = null;
    let matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};
    
    if (matches.length !== 3) {
        return {
            message: 'input invalid',
            data: null
        }
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    console.log("data: ",response.data)
    try {   
        
        const decodeImage = response;
        let imageBuffer = decodeImage.data;

        let filePath =  appRoot + '/src/public/images/';
        let name = Date.now()+'.png';
        let fileName = filePath + name;
        let image = 'image-' + name;
        let upload = fs.writeFileSync(fileName, imageBuffer, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`File ${fileName} saved`);
            }
        });

        const checkUser = await Users.findByPk(userId);
        if(checkUser == 0){
            return {
                message: 'id not found',
                data: null
            }
        }

        const user = await Users.update({
            image: image 
        }, {
            where: {id : userId}
        }) 
        if(user) {
            userData = await getDetails(userId);
        }
        return {
            message: 'upload successfully',
            data: userData
        }

    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }  
}