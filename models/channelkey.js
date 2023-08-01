const { DataTypes } = require("sequelize");
const db = require("../db");


const ChannelKey = db.define("channelKey", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
})

module.exports = ChannelKey