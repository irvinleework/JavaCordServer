const db = require('../db');

const UserModel = require('./user');
const ChannelModel = require('./channel');
const ChannelEntryModel = require('./channelentry');

UserModel.hasMany(ChannelModel);
UserModel.hasMany(ChannelEntryModel)

ChannelModel.belongsToMany(UserModel,{through: "channelKey"});
ChannelModel.hasMany(ChannelEntryModel);

ChannelEntryModel.belongsTo(ChannelModel)

module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        ChannelModel,
        ChannelEntryModel
    }
}