const { DataTypes } = require("sequelize");
const db = require("../db");

const Channel = db.define("channel", {
    channelId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        // autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Channel;