const dotenv = require('dotenv')
const express = require('express');
const cors = require("cors")
const app = express();

//Getting config.env
dotenv.config({ path: './config.env' });

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}))

//Accepting JSON
app.use(express.json());

//We Link the router file to make our routing easy
app.use(require('./router/auth'));

// Securing KEY and PORT no
const PORT = process.env.PORT || 5000;

//Middleware
// const middleware = (req, res, next) => {
//     console.log("This is middleware");
//     next();
// }


//Listening to the PORT
app.listen(PORT, () => {
    console.log(`Server is successfully running on port no ${PORT}`);
})