import {
  getAll,
  getDetails,
  createTransaction,
  update,
  removeTransaction,
  totalTransaction
} from '../../services/transactionService';

let createNewTransaction = async (req, res) => {
    let {transaction_amount, note, user_id , category_id} = req.body
    if ( !transaction_amount || !note || !user_id || !category_id) {
      res.sendBadRequestError('content can not be empty');
    }

    try{
      const params = {
        transaction_amount: req.body.transaction_amount,
        note: req.body.note,
        user_id: req.body.user_id,
        category_id: req.body.category_id,
      }
      const response = await createTransaction({params});
      return res.sendCreateSuccess(response.message, response.data)
    }catch(e){
      return res.sendBadRequestError('something went wrong when create transaction')
    }
  };

let getAllTransactions = async (req, res) => {
  try{
    const response = await getAll();
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
};

let getUserTransactions = async (req, res) => {
  const id = req.params.id;
  try{
    const response = await getDetails(id);
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
};

let updateTransaction = async (req, res) => {
  const id = req.params.id;
  let params = req.body;
  try{
    const response = await update({id,params});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('something went wrong when update transaction')
  }
};

let deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const id = req.params.id;
  try{
    const response = await removeTransaction({id});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('some error occured when removing transaction');
  }
};

let getUserTotalTransaction = async (req, res) => {
    const userId = req.params.id;
  try{
    const response = await totalTransaction({userId});
    return res.sendSuccess(response.message, response.data)
  }catch(e){
    return res.sendBadRequestError('error')
  }
   
}

export default {
    getAllTransactions,
    getUserTransactions, 
    createNewTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getUserTotalTransaction
}