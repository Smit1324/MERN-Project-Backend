const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authentication');
const cookieParser = require("cookie-parser");

router.use(cookieParser());

//Requiring the connection to DB
require('../db/conn');

// Requiring the schema we made
const User = require('../models/userSchema');


router.get('/', (req, res) => {
    res.send("Heyy there, how are you doing ??");
})

// Using Promises
// router.post('/register', (req, res) => {
//     // Object Destructuring
//     const { name, email, phone, job, password, cpassword } = req.body

//     // Validations
//     if (!name || !email || !phone || !job || !password || !cpassword) {
//         return res.status(422).json({ error: "Please fill all the credentials" });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "User already exists" });
//             }

//             const user = new User({ name, email, phone, job, password, cpassword });

//             user.save().then(() => {
//                 res.status(201).json({ message: "Registration Successful" });
//             }).catch(err => {
//                 res.status(500).json({ error: "Registration Failed" });
//             })
//         }).catch(err => {
//             console.log(err);
//         })

// })

// Using async-await
router.post('/register', async (req, res) => {

    // Object Destructuring
    const { name, email, phone, job, password, cpassword } = req.body

    // Validations
    if (!name || !email || !phone || !job || !password || !cpassword) {
        return res.status(400).json({ error: "Please fill all the credentials" });
    }

    try {

        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "User already exists" });
        }
        else if (password != cpassword) {
            return res.status(412).json({ error: "Password doesn't match" });
        }
        else {
            const user = new User({ name, email, phone, job, password, cpassword });

            await user.save();
            res.status(201).json({ message: "Registration Successful" });
        }

    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ alert: "Fill all the credentials" });
        }

        const userLogin = await User.findOne({ email: email });

        if (!userLogin) {
            res.status(404).json({ error: "No data found !!!" })
        }
        else {

            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                res.status(404).json({ error: "Invalid credentials" });
            }
            else {
                const token = await userLogin.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 724800000),
                    httpOnly: true,
                });

                res.json({ message: "Login successful" });
            }

        }

    } catch (err) {
        console.log(err);
    }
})

router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
})

router.get('/getdata', authenticate, (req, res) => {
    res.send(req.rootUser);
})

router.post('/contact', authenticate, async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Please fill all the credentials" });
        }

        const verifyUser = await User.findOne({ _id: req.userId });

        if (verifyUser) {

            await verifyUser.addMessage(message);

            res.status(201).json({ message: "Successful" });

        }

    } catch (err) {
        console.log(err);
    }

})

router.get('/logout', (req, res) => {
    res.clearCookie('jwt', { path: '/' });
    res.status(200).send("Logout Successful");
})

module.exports = router