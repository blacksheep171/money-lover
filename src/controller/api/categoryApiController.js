import { 
  createCategory, 
  getAll,
  getDetails,
  update,
  removeCategory 
} from '../../services/categoryService';

let createNewCategory = async (req, res) => {

  let {name, description, user_id} = req.body
  if ( !name || !description || !user_id) {
    return res.sendBadRequestError('content can not be empty.');
  }

  try{
    const params = {
      name: req.body.name,
      description: req.body.description,
      user_id: req.body.user_id,
    };
    const response = await createCategory({params});
    return res.sendCreateSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('something went wrong when create category')
  }
};

let getAllCategories = async (req, res) => {
  try{
    const response = await getAll();
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
};

let getCategory = async (req, res) => {
  const id = req.params.id;
  try{
    const response = await getDetails(id);
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
};

let updateCategory = async (req, res) => {
  const id = req.params.id;
  let params = req.body;
  try{
    const response = await update({id,params});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('something went wrong when update category')
  }
};

let deleteCategory = async (req, res) => {
  const id = req.params.id;
  try{
    const response = await removeCategory({id});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('some error occured when removing category');
  }
};

export default {
    getAllCategories,
    createNewCategory,
    getCategory,
    updateCategory,
    deleteCategory
}