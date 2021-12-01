const router = require("express").Router();
const {models} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require('sequelize/lib/errors');



router.post("/register", async (req, res) => {
    let { email, password, userName, firstName, lastName } = req.body.user;
    try {
        let User = await models.UserModel.create({
            email,
            password: bcrypt.hashSync(password, 13),
            userName,
            firstName,
            lastName
        });

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch(err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            })
        } else {
            res.status(500).json({
                error: `Failed to register user : ${err}`
            })
        }
    }
});

// router.post('/register', async (req, res) =>{
//     const {email, password, userName, firstName, lastName} = req.body.user;
//     try {
//         await models.UserModel.create({
//             email: email,
//             password: bcrypt.hashSync(password, 10),
//             username: userName,
//             firstname: firstName,
//             lastname: lastName
//         })
//         .then(
//             user => {
//                 let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
//                 res.status(201).json({
//                     user: user,
//                     message: 'user created',
//                     sessionToken: token
//                 });
//             }
//         )
//     } catch (err) {
//         if (err instanceof UniqueConstraintError) {
//             res.status(409).json({
//                 message: 'Username already in use'
//             });
//         } else {
//             res.status(500).json({
//                 error: `Failed to register user: ${err}`
//             });
//         };
//     };
// });


router.post("/login", async (req, res) => {
    let {email, password} = req.body.user;
    try{
        let loginUser = await models.UserModel.findOne({
            where: {
                email: email,
            }
        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password)
            

            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in",
                    sessionToken: token

                })
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        } 
    } catch (error) {
        res.status(500).json({
            message: "Failed to log in user"
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const userInfo = await models.UserModel.findAll({
            include: [
                {
                    model: models.ChannelModel,
                    include: [
                        {
                            model: models.ChannelEntryModel
                        }
                    ]
                }
            ]
        });
        res.status(200).json(userInfo)
    } catch (err) {
        res.status(500).json({ error: err })
    }
    });


module.exports = router;