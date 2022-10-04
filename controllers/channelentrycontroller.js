const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const {models} = require('../models')

router.post("/create/:id", validateJWT, async (req, res) => {
    const {entry} = req.body.channelentry
    const channelMessage = {
        entry,
        userId: req.user.id,
        channelId: req.params.id
    }
    const query = {
        where: {
            id: req.params.id
        }
    }
    try {
        const currentChannelId =  await models.ChannelModel.findOne({
            where: {
                id: req.params.id
            }
        })
       
                const newChannel = await models.ChannelEntryModel.create(channelMessage, currentChannelId, query);
                // const newChannel = await models.ChannelEntryModel.findOrCreate({
                //     where: {
                //         entry,
                //         userId: req.user.id,
                //         channelId: req.params.id
                //     }
                // })
        res.status(200).json(newChannel)
    } catch (err) {
        res.status(500).json({error: err})
    }
})
router.get("/:id", async (req, res) => {
    
    try {
        const query = {
        where: {
            id: req.params.id
            }
        }
        const messages = await models.ChannelEntryModel.findAll({
            include: [{
                model: models.ChannelModel,
                where: { id: req.params.id }
            }],
        });
        
        // console.log(messages.getChannelEntrys())
        
        console.log(messages)
        res.status(200).json({messages,
            id: req.params.id})
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