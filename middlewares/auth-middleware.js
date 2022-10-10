require('dotenv').config();
const jwt = require("jsonwebtoken");
const {Users} = require("../models");


module.exports = (req, res, next) => {
    const authorization = req.cookies.token;

    if (!authorization) {
        res.status(401).json({
            errorMessage: "로그인 후 이용이 가능합니다.",
        });
        return;
    }

    try {
        const {userId} = jwt.verify(authorization, process.env.TOKENKEY);
        Users.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        res.status(401).json({
            errorMessage: "로그인 후 이용이 가능합니다.",
        });
    }
};