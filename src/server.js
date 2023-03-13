// required library
import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from "./route/web";
import initAPIRoute from "./route/api";
import connection from './configs/connectDB';
import db from "./models";
var cors = require('cors');

var morgan = require('morgan');
require('dotenv').config();
// create instance
const app = express()
const port = process.env.PORT

app.use(cors());

app.use((req, res, next) => {
  console.log('>>> my middleware');
  console.log(req.method);
  next();
});
// declare middleware 
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup view engine
configViewEngine(app);
// init web route
initWebRoute(app);

//init api route
initAPIRoute(app);

// const db = require("./src/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})