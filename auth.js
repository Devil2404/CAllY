const express = require('express');
const router = express.Router();
const User = require('../module/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'D3VIL';
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


//1) router for user creation no login required
router.post('/createuser',
    [

        //this is the layer of validation for no data multiplaction
        body('name', 'Enter a valid name ').isLength({ min: 3 }),
        body('username', 'Enter a valid username').isLength({ min: 5 }),
        body('password', 'Enter a valid password ').isLength({ min: 8 }),
        body('email', 'Enter a valid password').isEmail(),
    ],
    async (req, res) => {


        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            //if there is any user then its not going further
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Sorry a user with this email is already exists" });
            }

            // salt and hash generation
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);


            //user creation
            user = await User.create({
                name: req.body.name,
                username: req.body.username,
                password: secPass,
                email: req.body.email

            })


            //authToken generation using user id which is the primary key for us
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            res.status(200).json({ authToken: authToken });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });


//2)  router for login for any user authtoken required
router.post('/login',
    [
        //this is the layer of validation for no data multiplaction
        body('password', 'Password can not be blank').exists(),
        body('email', 'Enter a valid password').isEmail()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //password and email destructing
        const { email, password } = req.body;


        try {
            //user find with there email
            let user = await User.findOne({ email: email });

            //if someone try to login with another email then checking for this 
            if (!user) {
                return res.status(400).json({ errors: "Please try to login with correct credentials" });
            }

            //password comparison for hash
            const passwordComp = await bcrypt.compare(password, user.password);
            if (!passwordComp) {
                return res.status(400).json({ errors: "Please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }

            //authToken return
            const authToken = jwt.sign(data, JWT_SECRET);
            res.status(200).json({ authToken: authToken });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Occured");
        }

    });

//3) router when after login u need to find users detail
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password");
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
});


//4) router for logout 
router.get('/logout', function (req, res) {
    delete req.session;
    res.status(200).send("You have logout successfully")
    res.redirect('/');
})


module.exports = router;