const db = require('../db');
const { DataTypes } = require("sequelize");

const UserModel = require('./user');
const ChannelModel = require('./channel');
const ChannelEntryModel = require('./channelentry');


const ChannelKey = db.define("ChannelKey", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
})

UserModel.belongsToMany(ChannelModel, {as: "Channel", foreignKey: "userId", through: "ChannelKey"});
ChannelModel.belongsToMany(UserModel,{as: "User", foreignKey: "channelId", through: "ChannelKey"});
ChannelModel.belongsTo(UserModel, {foreignKey: "owner"})
UserModel.hasMany(ChannelKey);
ChannelKey.belongsTo(UserModel);
ChannelModel.hasMany(ChannelKey);
ChannelKey.belongsTo(ChannelModel);
UserModel.hasMany(ChannelEntryModel, {foreignKey: "userId"});
ChannelEntryModel.belongsTo(UserModel);

ChannelModel.hasMany(ChannelEntryModel, {foreignkey: "channelId"});
ChannelEntryModel.belongsTo(ChannelModel)



module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        ChannelModel,
        ChannelEntryModel
    }
}