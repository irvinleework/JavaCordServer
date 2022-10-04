const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const { models } = require('../models')
const Sequelize = require('sequelize');
const Channel = require('../models/channel');

router.post('/create', validateJWT, async (req, res) => {
    const { name } = req.body.channel;
    const channelEntry = {
        name,
        owner: req.user.id
    }
    try {
        const newChannel = await models.ChannelModel.create(channelEntry);
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
    let {userId} = req.user.id
    try{
        const userChannels = await models.ChannelModel.findAll({
            where: {
                owner: req.user.id
            }
        });
        res.status(200).json(userChannels)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})
router.get("/invited", validateJWT, async (req, res) => {
    try{
        const invitedUsers = await models.ChannelModel.findAll({
            include: [{
                model: models.UserModel,
                as: "User",
                where: { id: req.user.id}
            }]
        });
        res.status(200).json(invitedUsers)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})
router.put("/update/:id", validateJWT, async (req, res) => {
    const { name } = req.body.channel;
    const channelId = req.params.id;

    const query = {
        where: {
            id: req.params.id,
            userId: req.user.id
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

router.delete("/delete/:id", validateJWT, async (req, res) => {
    try {
        const query = {
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        };
        await models.ChannelModel.destroy(query);
        res.status(200).json({message: "Channel has been deleted"})
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/adduser/:id', validateJWT, async (req, res) => {
    const {userName} = req.body.user
    try {
    const currentChannel =  await models.ChannelModel.findOne({
        where: {
            id: req.params.id
        }
    })

    const addUserToChannel =  await models.UserModel.findOne({
        where: {
            userName: userName
        }
    })
    const query = {
        where: {
            userId: req.user.id
        }
    }
        const addUserName = await currentChannel.addUser(addUserToChannel, query)
        res.status(200).json(addUserName)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
})

module.exports = router;
