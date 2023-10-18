const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const { models } = require('../models')
const Sequelize = require('sequelize');
const Channel = require('../models/channel');
const channelEntry = require('./channelentrycontroller');
const User = require('../models/user');
const ChannelKey = require('../models/channelkey');
const { channelKeyController } = require('.');

router.post('/create', validateJWT, async (req, res) => {
    const { name } = req.body.channel;
    const channelEntry1 = {
        name,
        owner: req.user.userId
    }
    try {
        const newChannel = await models.ChannelModel.create(channelEntry1);
        res.status(200).json(newChannel);
    } catch(err) {
        res.status(500).json({error: err});
    }
});

router.get("/", async (req, res) => {
    try {
        const entries = await models.ChannelModel.findAll();
        res.status(200).json(entries)
    } catch (err) {
        res.status(500).json({ error: err })
    }
    });

router.get("/mine", validateJWT, async (req, res) => {
    let {userId} = req.user.userId
    try{
        const userChannels = await models.ChannelModel.findAll({
            where: {
                owner: req.user.userId
            }
        });
        res.status(200).json(userChannels)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})
router.get("/invited/:channelId", validateJWT, async (req, res) => {
    const channelId = req.params.channelId;
    try{
        const invitedUsers = await models.ChannelModel.findAll({
            where: {
                channelId: req.params.channelId
            },
            include: [{
                model: models.UserModel,
                as: "User",
                
            }]
        });
        res.status(200).json(invitedUsers)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})


router.put("/update/:channelId", validateJWT, async (req, res) => {
    const { name } = req.body.channel;
    const channelId = req.params.channelId;

    const query = {
        where: {
            channelId: channelId,
            owner: req.user.userIdd
        }
    }
    const updatedChannel = {
        name: name
    }
    try {
        const update = await models.ChannelModel.update(updatedChannel, query);
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

router.delete("/delete/:channelId", validateJWT, async (req, res) => {
    try {
        const query = {
            where: {
                channelId: req.params.channelId,
                owner: req.user.userId
            }
        };
        await models.ChannelModel.destroy(query);
        res.status(200).json({message: "Channel has been deleted"})
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/adduser/:channelId', validateJWT, async (req, res) => {
    const {userName} = req.body.user
    try {
    const currentChannel =  await models.ChannelModel.findOne({
        where: {
            channelId: req.params.channelId
        }
    })

    const addUserToChannel =  await models.UserModel.findOne({
        where: {
            userName: userName
        }
    })
    const query = {
        where: {
            userId: req.user.userId
        }
    }
        const addUserName = await currentChannel.addUser(addUserToChannel, query)
        res.status(200).json(addUserName)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
})
router.use('/:channelId/channelentry', channelEntry)
module.exports = router;
