import db from "../models";
const Users = db.users;
const Categories = db.categories;
const Op = db.Sequelize.Op;

// Create and Save a new Category
let createNewCategory = async (req, res) => {
  // Validate request
  let {name, description, user_id} = req.body
  if ( !name || !description || !user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Category
  const category = {
    name: req.body.name,
    description: req.body.description,
    user_id: req.body.user_id,
  };
  // const user = {first_name, last_name, balance, phone, address};
  let user = Users.findByPk(user_id)
  .then(result => {
    if (!result) {
      res.status(404).send({
        message: "Cannot find User"
      });
    }
  });
  // Save User in the database
  await Categories.create(category)
    .then(result => {
      res.status(200).send({
        message: "success",
        data: result      
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    });
};

// Retrieve all Categories from the database.
let getAllCategories = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
    await Categories.findAll({ where: condition })
      .then(result => {
        res.status(200).send({
          message: "success",
          data: result      
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Categories."
        });
      });
  };

  // Find a single Category with an id
let getCategory = async (req, res) => {
  let categoryId = req.params.id;
  await Categories.findByPk(categoryId)
    .then(result => {
      if (result) {
        res.status(200).send({
          message: "success",
          data: result      
        });
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${categoryId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + categoryId
      });
    });
};

let updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log(">>> check id", categoryId);
  await Categories.update(req.body, {
    where: { id: categoryId }
  })
    .then((num) => {
      if (num == 1) {
        console.log(">>> check number", num);
        res.status(200).send({
          message: "Category was updated successfully"     
        });
      } else {
        res.status(404).send({
          message: `Cannot update Category with id=${categoryId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Category with id=" + categoryId
      });
    });
};

// Delete all Users from the database.
let deleteCategory = async (req, res) => {
  const cateogryId = req.params.id;
  await Categories.destroy({
    where: {id: cateogryId},
  })
    .then(() => {
      res.send({ message: `deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing Category."
      });
    });
};

module.exports = {
    getAllCategories, createNewCategory, getCategory, updateCategory, deleteCategory
}