// required library
import express from 'express';
import configViewEngine from './configs/viewEngine';
require('dotenv').config();
// create instance
const app = express()
const port = process.env.PORT

// console.log(">> check port: ", port);

// console.log(process.env); 
configViewEngine(app);
app.get('/', (req, res) => {
  res.render('test/index.ejs')
})

app.get('/home', (req, res) => {
    res.send(`Welcome Home!`)
})
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})