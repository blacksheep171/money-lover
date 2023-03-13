import db from "../models";
const Users = db.users;
const Categories = db.categories;
const Transactions = db.transactions;
const Op = db.Sequelize.Op;

// Create and Save a new Category
let createNewTransaction = async (req, res) => {
    // Validate request
    let {transaction_amount, note, user_id , category_id} = req.body
    if ( !transaction_amount || !note || !user_id || !category_id) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Category
    const transaction = {
      transaction_amount: req.body.transaction_amount,
      note: req.body.note,
      user_id: req.body.user_id,
      category_id: req.body.category_id,
    };
    // const user = {first_name, last_name, balance, phone, address};
    // let user = Users.findByPk(user_id)
    // .then(result => {
    //   if (!result) {
    //     res.status(404).send({
    //       message: "Cannot find User"
    //     });
    //   }
    // });

    // let category = Categories.findByPk(category_id)
    // .then(result => {
    //   if (!result) {
    //     res.status(404).send({
    //       message: "Cannot find Category"
    //     });
    //   }
    // });
    // Save User in the database
    await Transactions.create(transaction)
      .then(result => {
        res.status(200).send({
          message: "success",
          data: result      
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Transact."
        });
      });
  };

// Retrieve all Transactions from the database.
let getAllTransactions = async (req, res) => {
    await Transactions.findAll()
    .then(result => {
    res.status(200).send({
        message: "success",
        data: result      
    });
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving Transactions."
    });
    });
};

// Find a single Transaction with an id
let getUserTransactions = async (req, res) => {
    let transactionId = req.params.id;
    await Categories.findByPk(transactionId)
    .then(result => {
        if (result) {
        res.status(200).send({
            message: "success",
            data: result      
        });
        } else {
        res.status(404).send({
            message: `Cannot find Transaction with id = ${transactionId}.`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Transaction with id=" + transactionId
        });
    });
};

let updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    console.log(">>> check id", transactionId);
    await Transactions.update(req.body, {
      where: { id: transactionId }
    })
      .then((num) => {
        if (num == 1) {
          console.log(">>> check number", num);
          res.status(200).send({
            message: "Transaction was updated successfully"     
          });
        } else {
          res.status(404).send({
            message: `Cannot update Transaction with id=${transactionId}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Transaction with id=" + transactionId
        });
      });
  };

  // Delete all Users from the database.
let deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;
    await Transactions.destroy({
      where: {id: transactionId},
    })
      .then(() => {
        res.send({ message: `deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing Transaction."
        });
      });
  };

module.exports = {
    getAllTransactions, getUserTransactions, createNewTransaction, updateTransaction, deleteTransaction
}