import db from "../models";
const Users = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
let createUser = async (req, res) => {
  // Validate request
  let {first_name, last_name, balance, phone, address} = req.body
  if ( !first_name || !last_name || !balance || !phone || !address) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    balance: req.body.balance ? req.body.balance : false,
    phone: req.body.phone,
    address: req.body.address,
  };
  // const user = {first_name, last_name, balance, phone, address};
  // Save User in the database
  Users.create(user)
    .then(result => {
      res.status(200).send({
        message: "success",
        data: result      
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
let getAll = async (req, res) => {
  const first_name = req.query.first_name;
  var condition = first_name ? { first_name: { [Op.like]: `%${first_name}%` } } : null;

  await Users.findAll({ where: condition })
    .then(result => {
      res.status(200).send({
        message: "success",
        data: result      
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

// Find a single User with an id
let getUser = async (req, res) => {
  const id = req.params.id;
  await Users.findByPk(id)
    .then(result => {
      if (result) {
        res.status(200).send({
          message: "success",
          data: result      
        });
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

let updateUser = async (req, res) => {
  const id = req.params.id;
  console.log(">>> check id", id);
  await Users.update(req.body, {
    where: { id: id }
  })
    .then((num) => {
      if (num == 1) {
        console.log(">>> check number", num);
        res.status(200).send({
          message: "Users was updated successfully",
          // data: user      
        });
      } else {
        res.status(404).send({
          message: `Cannot update Users with id=${id}. Maybe Users was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Users with id=" + id
      });
    });
};

// Delete all Users from the database.
let deleteUser = async (req, res) => {
  let userId = req.params.id;
      if(!userId) {
          return res.status(200).json({
              message: "required id"
          })
      }
  await Users.destroy({
    where: {id: userId},
  })
    .then(() => {
      res.send({ message: `deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing User."
      });
    });
};

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
    await Users.update({
      image: image
    }, {
      where: { id: userId }
    })
      .then(num => {
        if (num == 1) {
          console.log(">>> check number", num);
          res.status(200).send({
            message: "You have uploaded this image",
            // data: user      
          });
        } else {
          res.status(404).send({
            message: `Image can not upload, please try later!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Users image."
        });
      });
  // await pool.execute('update users set image = ? where id = ?', [image, id]);
  // return res.status(200).json({
  //     message: 'You have uploaded this image'
  // })

}
module.exports = {
  getAll, getUser, createUser, updateUser, deleteUser, handleUploadFile
}