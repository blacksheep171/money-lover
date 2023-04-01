import {
  getAllUsers,
  registerUser,
  loginUser,
  getDetails,
  createUser,
  updateUser,
  removeUser,
  handleUploadImage
} from  '../../services/userService';

let create = async (req, res) => {

  let { first_name, last_name, email, password, balance, phone, address } = req.body
  if (!first_name || !last_name || !email || !password || !balance || !phone || !address) {
    res.sendBadRequestError('content can not be empty');
    return;
  }
 
  const params = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: password,
    balance: req.body.balance ? req.body.balance : false,
    phone: req.body.phone,
    address: req.body.address,
  };
  try{
      const response = await createUser({params});
      return res.sendCreateSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('can not create user')
  }
};

let getAll = async (req, res) => {
  try{
    const response = await getAllUsers();
    return res.sendSuccess('success', response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
}
 
// // user login
let login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return  res.sendBadRequestError("The email and password is required")
  }
  const params = {
    email: req.body.email,
    password: password
  }
  try{
    const response = await loginUser({params});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
}

let register = async (req, res) => {

  let { first_name, last_name, email, password, balance, phone, address } = req.body;
  if (!first_name || !last_name || !email || !password || !balance || !phone || !address) {
    return  res.sendBadRequestError("content can not be empty")
  }

    const params = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: password,
      balance: req.body.balance ? req.body.balance : null,
      phone: req.body.phone,
      address: req.body.address,
    };
    try{
        const response = await registerUser({params});
        return res.sendCreateSuccess(response.message, response.data)
    }catch(e){
      return res.sendBadRequestError('register failed, please try later')
    }
}

let getUser = async (req, res) => {
  const id = req.params.id;
  try{
    const response = await getDetails(id);
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
}

let update = async (req, res) => {
  const userId = req.params.id;

  let params = req.body;

  try{
    const response = await updateUser({userId,params});
    console.log(response);
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('something went wrong when update user')
  }
};

let deleteUser = async (req, res) => {
  const userId = req.params.id;
  try{
    const response = await removeUser({userId});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('Some error occurred while removing User')
  }
}

let uploadImage = async (req, res) => {
  let userId = req.params.id;
  if (!userId) {
    return res.sendBadRequestError('required id')

  }

  if (req.fileValidationError) {
    return res.sendBadRequestError(req.fileValidationError);
  }
  else if (!req.file) {
    return res.sendNotfoundError('Please select an image to upload');
  }
  
  try{
      // let image = path.join(__dirname,req.file.filename);
      let image = req.file.filename;  
      const response = await handleUploadImage({userId,image});
    if(!response) {
      return res.sendBadRequestError('Image can not upload, please try later!');
    } else {
      return res.sendSuccess('upload successfully', response.data);
    }
  }catch(e){
    return res.sendServerError('something went wrong when update image');
  }

  // let image = path.join(__dirname,req.file.filename);
  // let image = req.file.filename;
  // console.log(">>> avatar:", image);
  // // Display uploaded image for user validation
  // await Users.update({
  //   image: image
  // }, {
  //   where: { id: userId }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       console.log(">>> check number", num);
  //       res.status(200).send({
  //         message: "You have uploaded this image",
  //         // data: user      
  //       });
  //     } else {
  //       res.status(404).send({
  //         message: `Image can not upload, please try later!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating Users image."
  //     });
  //   });
}

export default {
  getAll,
  getUser,
  create,
  deleteUser,
  update,
  uploadImage,
  register,
  login
}