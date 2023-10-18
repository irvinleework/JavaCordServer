const router = require("express").Router();
const {models} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require('sequelize/lib/errors');
const validateJWT = require("../middleware/validate-jwt");



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

        let token = jwt.sign({userId: User.userId}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch(err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email or Username already in use"
            })
        } else {
            res.status(500).json({
                error: `Failed to register user : ${err}`
            })
        }
    }
});

// router.get("/invited", validateJWT, async (req, res) => {
//     try{
//         const invitedUsers = await models.UserModel.findAll({
//             where:{
//                 channelId: req.params.channelId
//             }
//         });
//         res.status(200).json(invitedUsers)
//     } catch(err) {
//         console.log(err)
//         res.status(500).json({ error: err })
//     }
// })



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
                let token = jwt.sign({userId: loginUser.userId}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
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
            where: {
                channelId: req.channel.channelId
            }
        });
        res.status(200).json(userInfo)
    } catch (err) {
        res.status(500).json({ error: err })
    }
    });
router.get('/invitedchannels', validateJWT, async (req, res) => {
    try {
        const invitedChannels = await models.UserModel.findAll({
            where: {
                userId: req.user.userId
            },
            include: [{
                model: models.ChannelModel,
                as: 'channel',

            }]
        });
        res.status(200).json(invitedChannels)
    } catch(err) {
        res.status(500).json({error: err})
    }
})
module.exports = router;