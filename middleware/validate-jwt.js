const jwt = require("jsonwebtoken");
const { models } = require("../models");

const validateJWT = async (req, res, next) => {
    if (req.method == "OPTIONS") {
        next();
    } else if (req.headers.authorization) {
        const { authorization } = req.headers;
        const payload = authorization ? jwt.verify(authorization, process.env.JWT_SECRET) : undefined;

        if (payload) {
            let foundUser = await models.UserModel.findOne({
                where: { userId: payload.userId } 
            });

            if (foundUser) {
                req.user = foundUser;
                next();
            } else {
                res.status(400).send({ message: "Not Authorized"});
            }
        } else {
            res.status(401).send({ message: "Invalid Token"});
        }
    } else {
        res.status(403).send({ message: "Forbidden"});
    }
};

module.exports = validateJWT;