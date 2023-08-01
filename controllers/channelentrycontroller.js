const Express = require('express');
const channelEntry = Express.Router({mergeParams: true});
let validateJWT = require("../middleware/validate-jwt")
const {models} = require('../models')

channelEntry.get("/", async (req, res) => {
    const channelId = req.params.channelId
    const userName = req.body.userName
    try {
        const query = {
        where: {
            channelId: channelId
            }
        }
        const messages = await models.ChannelEntryModel.findAll({
            include: [{
                model: models.ChannelModel,
                where: { channelId: channelId }
            }, {
                model: models.UserModel
            }],
        });
        
        // console.log(messages.getChannelEntrys())

        res.status(200).json({messages})
    } catch (err) {
        res.status(500).json({error: err})
    }
});
channelEntry.post("/create", validateJWT, async (req, res) => {
    const {entry} = req.body.channelentry
    const channelId = req.params.channelId
    const channelMessage = {
        entry,
        userId: req.user.userId,
        channelId: channelId
    }
    try {
        const currentChannelId =  await models.ChannelModel.findOne({
            where: {
                channelId: channelId
            }
        })
        
                const newChannel = await models.ChannelEntryModel.create(channelMessage, currentChannelId);
                // const newChannel = await models.ChannelEntryModel.findOrCreate({
                //     where: {
                //         entry,
                //         userId: req.user.id,
                //         channelId: req.params.id
                //     }
                // })
                
        res.status(200).json(newChannel)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
})
channelEntry.get("/:entry", async (req, res) => {
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
channelEntry.put("/update/:channelEntryId", validateJWT, async (req, res) => {
    const {entry} = req.body.channelentry;
    const channelId = req.params.channelId
    const query = {
        where: {
            channelEntryId: req.params.channelEntryId,
            userId: req.user.userId,
            channelId: channelId
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

channelEntry.delete("/delete/:channelEntryId", validateJWT, async (req, res) => {


    try {
        const query = {
            where: {
                channelEntryId: req.params.channelEntryId,
                userId: req.user.userId
            }
        };
        await models.ChannelEntryModel.destroy(query);
        res.status(200).json({message: "Entry has been deleted"})
    } catch (err) {
        res.status(500).json({error: err})
    }
})
module.exports = channelEntry;