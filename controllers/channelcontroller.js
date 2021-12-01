const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const { models } = require('../models')

router.post('/create', validateJWT, async (req, res) => {
    const { name } = req.body.channel;
    let {id} = req.user.id
    const channelEntry = {
        name,
        userId: req.user.id
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
    try{
        const userChannels = await models.ChannelModel.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json(userChannels)
    } catch(err) {
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

module.exports = router;