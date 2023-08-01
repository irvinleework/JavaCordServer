const { DataTypes } = require("sequelize");
const db = require("../db");

const ChannelEntry = db.define("channelentry", {
    channelEntryId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    entry: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = ChannelEntry;