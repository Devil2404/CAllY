const express = require('express');
const router = express.Router();
const Profile = require('../module/Profile');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


//1) router for profile creation or update login required
router.post('/updateuser',
    fetchuser,
    [
        //this is the layer of validation for no data multiplaction
        body('Name', 'Enter a valid name ').isLength({ min: 3 }),
        body('subname', 'Enter a valid title').isLength({ min: 3 }),
        body('address', 'Enter a valid address ').isLength({ min: 20 }),
        body('phone', 'Enter a valid phone number ').isLength({ min: 10 }),
        body('profile', 'enter a valid description about you ').isLength({ min: 100 }),
        body('gmail', 'Enter a valid password').isEmail(),
    ],
    async (req, res) => {


        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            //if there is any user then its not going further
            const { Name, subname, address, gmail, phone, profile, linkedin } = req.body;

            //find the  details of user only one
            let pro = await Profile.findOne({ user: req.user.id });
            if (pro) {
                const newPro = {}
                if (Name) { newPro.Name = Name }
                if (subname) { newPro.subname = subname }
                if (address) { newPro.address = address }
                if (phone) { newPro.phone = phone }
                if (profile) { newPro.profile = profile }
                if (linkedin) { newPro.linkedin = linkedin }

                //to check the user is update thier details otr not
                if (pro.user.toString() !== req.user.id) {
                    return res.status(401).send("Not allowed");
                }
                //to update the details of user by find one
                pro = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: newPro }, { new: true });
                res.status(200).json(pro);
            }
            else {
                // user details creation
                pro = await Profile.create({
                    user: req.user.id,
                    Name: Name,
                    subname: subname,
                    address: address,
                    phone: phone,
                    gmail: gmail,
                    profile: profile,
                    linkedin: linkedin
                })

                res.status(200).json(pro);
            }

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });


//2) router when after login u need to find users profile
router.get('/getpro', fetchuser, async (req, res) => {
    try {
        let pro = await Profile.find({ user: req.user.id });
        res.status(200).json(pro);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
});


module.exports = router;