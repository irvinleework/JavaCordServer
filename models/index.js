const db = require('../db');

const UserModel = require('./user');
const ChannelModel = require('./channel');
const ChannelEntryModel = require('./channelentry');
const ChannelKey = require('./channelkey')

UserModel.belongsToMany(ChannelModel, {as: "Channel", foreignKey: "userId", otherKey: "channelId", through: "channelKey"});
ChannelModel.belongsToMany(UserModel,{as: "User", foreignKey: "channelId", otherKey:"userId", through: "channelKey"});
ChannelModel.belongsTo(UserModel, {foreignKey: "owner"})
UserModel.hasMany(ChannelEntryModel, {foreignKey: "userId"});
ChannelEntryModel.belongsTo(UserModel, {foreignKey: "userId"});
ChannelModel.hasMany(ChannelEntryModel, {foreignKey: "channelId"});
ChannelEntryModel.belongsTo(ChannelModel, {foreignKey: "channelId"})
// UserModel.hasMany(ChannelKey)
// ChannelKey.belongsTo(UserModel)
// ChannelModel.hasMany(ChannelKey)
// ChannelKey.belongsTo(ChannelModel)


module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        ChannelModel,
        ChannelEntryModel,
        ChannelKey
    }
}