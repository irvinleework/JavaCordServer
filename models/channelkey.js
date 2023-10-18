const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require('./user');
const Channel = require('./channel');

const ChannelKey = db.define("channelkey", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'user',
            key: 'id',
          },
          unique: false
    },
    channelId: {
        type: DataTypes.UUID,
        references: {
            model: 'channel',
            key: 'id'
        },
        unique: false
    }
})

module.exports = ChannelKey