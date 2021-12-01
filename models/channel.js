const { DataTypes } = require("sequelize");
const db = require("../db");

const Channel = db.define("channel", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Channel;