import jwt from 'jsonwebtoken';
import {
  getAllUsers,
  registerUser,
  loginUser,
  refreshTokenGeneral,
  getDetails,
  createUser,
  updateUser,
  removeUser,
  handleUploadImage,
  handleUploadBase64,
  generalRefreshToken,
} from '../../services/userService';

const create = async (req, res) => {
  const {
    first_name, last_name, email, password, balance, phone, address,
  } = req.body;
  if (
    !first_name
    || !last_name
    || !email
    || !password
    || !balance
    || !phone
    || !address
  ) {
    res.sendBadRequestError('content can not be empty');
    return;
  }

  const params = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password,
    balance: req.body.balance ? req.body.balance : false,
    phone: req.body.phone,
    address: req.body.address,
  };
  try {
    const response = await createUser({ params });
    return res.sendCreateSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('can not create user');
  }
};

const getAll = async (req, res) => {
  try {
    const response = await getAllUsers();
    return res.sendSuccess('success', response.data);
  } catch (e) {
    return res.sendBadRequestError('error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendBadRequestError('The email and password is required');
  }
  const params = {
    email: req.body.email,
    password,
  };
  try {
    const response = await loginUser({ params });
    return res.sendSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('error');
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.headers.token;

  try {
    if (!refreshToken) {
      return res.sendBadRequestError('token invalid');
    }
    const params = {
      token: refreshToken,
    };
    // const response = await refreshTokenGeneral({params});
    jwt.verify(params.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.sendSuccess({
          message: 'The user is not authentication',
          data: null,
        });
      }
      if (user) {
        const userId = user.id;
        const payload = {
          id: userId,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        console.log('>> payload: ', payload);
        const access_token = generalRefreshToken(payload);
        console.log('access_token: ', access_token);
        res.sendSuccess({
          message: 'token refresh successfully',
          data: {
            token: access_token,
          },
        });
      } else {
        res.sendBadRequestError({
          message: 'The user is not found',
          data: null,
        });
      }
    });

    // return res.sendSuccess(response.message, response.data)
  } catch (e) {
    console.log(e);
    return res.sendBadRequestError(
      'create refresh token failed, please try later',
    );
  }
};

const register = async (req, res) => {
  const {
    first_name, last_name, email, password, balance, phone, address,
  } = req.body;
  if (
    !first_name
    || !last_name
    || !email
    || !password
    || !balance
    || !phone
    || !address
  ) {
    return res.sendBadRequestError('content can not be empty');
  }

  const params = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password,
    balance: req.body.balance ? req.body.balance : null,
    phone: req.body.phone,
    address: req.body.address,
  };
  try {
    const response = await registerUser({ params });
    return res.sendCreateSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('register failed, please try later');
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getDetails(id);
    return res.sendSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('error');
  }
};

const update = async (req, res) => {
  const userId = req.params.id;

  const params = req.body;

  try {
    const response = await updateUser({ userId, params });
    console.log(response);
    return res.sendSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('something went wrong when update user');
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const response = await removeUser({ userId });
    return res.sendSuccess(response.message, response.data);
  } catch (e) {
    return res.sendBadRequestError('Some error occurred while removing User');
  }
};

const uploadImage = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.sendBadRequestError('required id');
  }

  if (req.fileValidationError) {
    return res.sendBadRequestError(req.fileValidationError);
  }
  if (!req.file) {
    return res.sendNotfoundError('Please select an image to upload');
  }

  try {
    // let image = path.join(__dirname,req.file.filename);
    const image = req.file.filename;
    const response = await handleUploadImage({ userId, image });
    if (!response) {
      return res.sendBadRequestError('Image can not upload, please try later!');
    }
    return res.sendSuccess('upload successfully', response.data);
  } catch (e) {
    return res.sendServerError('something went wrong when update image');
  }
};

const uploadBase64 = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.sendBadRequestError('required id');
  }

  const { image } = req.body;
  try {
    const response = await handleUploadBase64({ userId, image });
    if (!response) {
      return res.sendBadRequestError('Image can not upload, please try later!');
    }
    return res.sendSuccess('upload successfully', response.data);
  } catch (e) {
    return res.sendServerError('something went wrong when update image');
  }
};

export default {
  getAll,
  getUser,
  create,
  deleteUser,
  update,
  uploadImage,
  register,
  login,
  refreshToken,
  uploadBase64,
};
