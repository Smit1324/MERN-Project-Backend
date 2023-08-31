const mongoose = require('mongoose')

//Securing DB KEY
const DB = process.env.DATABASE;

//Connecting to DB
mongoose.connect(DB, {}).then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log("Connection Failed");
})