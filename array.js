const express = require('express');
const router = express.Router();
const Profile = require('../module/Array');
// const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


//1) router for profile add login required
router.post('/addarr',
    fetchuser,
    // [
    //     //this is the layer of validation for no data multiplaction
    //     body('educationdeg', 'Enter a  valid education degree ').isLength({ min: 9 }),
    //     body('educationun', 'Enter a valid education unvercity name').isLength({ min: 9 }),
    //     body('skillname', 'Enter a skill-name ').isLength({ min: 3 }),
    //     body('languagename', 'Enter a valid language-name ').isLength({ min: 3 }),
    //     body('excname', 'Enter a valid Company name ').isLength({ min: 8 }),
    //     body('expos', 'Enter a valid Position name ').isLength({ min: 5 }),
    //     body('exdep', 'Enter a valid Department name ').isLength({ min: 5 })

    // ],
    async (req, res) => {


        // const errors = validationResult(req);

        // //error checking 
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        try {

            //if there is any user then its not going further
            const { educationyear, educationdeg, educationun, skillper, skillname, languagename, languageper, interest, extime, excname, exdep, expos } = req.body;
            let pro = await Profile.findOne({ user: req.user.id });
            // console.log(req.user.id);
            if (pro) {


                // if user is try to add the info for some other person then its to prevent this 
                if (pro.user.toString() !== req.user.id) {
                    return res.status(401).send("Not allowed");
                }
                let newEd = {}
                let newSk = {}
                let newLa = {}
                let newEx = {}


                // if the user wants to add only education then its a condition
                if (educationyear && educationdeg && educationun) {
                    newEd = {
                        edyear: educationyear,
                        eddef: educationdeg,
                        edun: educationun
                    }

                    pro = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        {
                            $push: {
                                education: newEd
                            }
                        },
                        { new: true });
                }
                if (skillname && skillper) {
                    newSk = {
                        skper: skillper,
                        skname: skillname
                    };
                    pro = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        {
                            $push: {
                                skill: newSk
                            }
                        },
                        { new: true });
                }
                if (languagename && languageper) {
                    newLa = {
                        laper: languageper,
                        laname: languagename
                    }
                    pro = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        {
                            $push: {
                                language: newLa
                            }
                        },
                        { new: true });
                }
                if (extime && excname && expos && exdep) {
                    newEx = {
                        ext: extime,
                        exc: excname,
                        exp: expos,
                        exd: exdep
                    }
                    pro = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        {
                            $push: {
                                experience: newEx
                            }
                        },
                        { new: true });
                }
                if (interest) {
                    
               
                    pro = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        {
                            $push: {
                                interest: interest
                            }
                        },
                        { new: true });
                }
                res.status(200).json(pro);
            }
            else {
                // user creation
                const ed = {
                    edyear: educationyear,
                    eddef: educationdeg,
                    edun: educationun
                };
                const sk = {
                    skper: skillper,
                    skname: skillname
                };
                const la = {
                    laper: languageper,
                    laname: languagename
                }
                const ex = {
                    ext: extime,
                    exc: excname,
                    exp: expos,
                    exd: exdep
                }
                pro = await Profile.create({
                    user: req.user.id,
                    education: [ed],
                    skill: [sk],
                    language: [la],
                    interest: [interest],
                    experience: [ex]
                })

                res.status(200).json(pro);
            }

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });


//2) router when after login u need to find users profile
router.get('/getarr', fetchuser, async (req, res) => {
    try {
        let pro = await Profile.find({ user: req.user.id });
        res.status(200).json(pro);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
});

//3) router for update arrays in user profile
router.post('/updatearr', fetchuser, async (req, res) => {
    try {
        let pro = await Profile.find({ user: req.user.id });
        res.status(200).json(pro);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
});


module.exports = router;