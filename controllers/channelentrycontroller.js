const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const {models} = require('../models')

router.post("/create", validateJWT, async (req, res) => {
    const {entry, channelId} = req.body.channelentry
    const channelMessage = {
        entry,
        channelId: channelId,
        userId: req.user.id
    }
    try {
        const newChannel = await models.ChannelEntryModel.create(channelMessage);
        res.status(200).json(newChannel)
    } catch (err) {
        res.status(500).json({error: err})
    }
})
router.get("/", async (req, res) => {
    try {
        const messages = await models.ChannelEntryModel.findAll({
            include: [
                {
                    model: models.ChannelModel,
                    include: [
                        {
                            model: models.UserModel
                        }
                    ]
                }
            ]
        });
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({error: err})
    }
});
router.get("/:entry", async (req, res) => {
    const {entry} = req.params
    try {
        const userEntry = await models.ChannelEntryModel.findAll({
            where: {entry: entry}
        });
        res.status(200).json(userEntry)
    } catch (err) {
        res.status(500).json({error: err})
    }
});
router.put("/update/:id", validateJWT, async (req, res) => {
    const {entry} = req.body.channelentry;

    const query = {
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    }
    const updatedChannelEntry = {
        entry: entry
    }
    try {
        const updateEntry = await models.ChannelEntryModel.update(updatedChannelEntry, query);
        res.status(200).json(updateEntry)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const channelEntryId = req.params.id;

    try {
        const query = {
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        };
        await models.ChannelEntryModel.destroy(query);
        res.status(200).json({message: "Entry has been deleted"})
    } catch (err) {
        res.status(500).json({error: err})
    }
})
module.exports = router;