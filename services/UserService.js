// const Sequelize = require('sequelize')
// const { models } = require('../models')
// const Express = require('express');
// const router = Express.Router();

// class UserService {
//     constructor(Sequelize){
//         models(Sequelize);
//         this.client = Sequelize
//         this.models = Sequelize
//     }


// async addUserToChannel() {
//     const {userName} = req.body.user
//     try {
//         const currentUser = await models.UserModel.findOne({
//             where: {
//                 userName: userName
//             }
//         })
//         return currentUser
//     } catch(err) {
//         return err
//     }
// }
// }

// module.exports = UserService