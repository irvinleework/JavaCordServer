const db = require('../db');

const UserModel = require('./user');
const ChannelModel = require('./channel');
const ChannelEntryModel = require('./channelentry');
const ChannelKey = require('./channelkey')

UserModel.belongsToMany(ChannelModel, {through: ChannelKey, as: "channel", foreignKey: 'userId'});
ChannelModel.belongsToMany(UserModel,{through: ChannelKey, as: "User", foreignKey: 'channelId'});
ChannelModel.belongsTo(UserModel, {foreignKey: "owner"})
UserModel.hasMany(ChannelEntryModel, {foreignKey: "userId"});
ChannelEntryModel.belongsTo(UserModel, {foreignKey: "userId"});
ChannelModel.hasMany(ChannelEntryModel, {foreignKey: "channelId"});
ChannelEntryModel.belongsTo(ChannelModel, {foreignKey: "channelId"})
// UserModel.hasMany(ChannelKey)
// ChannelKey.belongsTo(UserModel, {as: 'user'})
// ChannelModel.hasMany(ChannelKey)
// ChannelKey.belongsTo(ChannelModel, {as: 'channel'})


module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        ChannelModel,
        ChannelEntryModel,
        ChannelKey
    }
}