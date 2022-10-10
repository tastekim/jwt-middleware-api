require("dotenv").config();
const express = require("express");
const {Users} = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const loginMiddleware = require("../middlewares/login-auth-middleware");


// 회원가입 기능
router.post("/signup", authMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        const {nickname, password, confirmPassword} = req.body;

        if (user !== null) {
            return res.status(400).json({errorMessage: "이미 로그인이 되어있습니다."});
        }

        // nickname 조건 확인.
        if (!(/^[a-zA-Z0-9]{3,}$/).test(nickname)) {
            throw "nickname 양식을 지켜주세요.";
        }

        // password 조건 확인.
        if (password.search(nickname) > -1) {
            throw "nickname 을 password 에 포함할 수 없습니다.";

        }

        // 비밀번호 일치 여부 확인.
        if (password !== confirmPassword) {
            throw "패스원드가 패스워드확인과 일치하지 않습니다.";
        }

        // nickname 중복 확인.
        const existUsers = await Users.findAll({
            where: {
                nickname: nickname
            }
        });
        if (existUsers.length > 0) {
            console.log(existUsers);
            throw "이미 존재하는 닉네임 입니다.";
        }

        // 유저 정보 생성.
        await Users.create({nickname, password});
        res.status(200).json({message: "회원가입에 성공했습니다 !"});
    } catch (err) {
        console.log(err);
        res.status(400).json({err});
    }


});

// login 기능.
router.post("/login", loginMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        const {nickname, password} = req.body;
        // console.log(user);
        // if (user !== null) {
        //     return res.status(400).json({errorMessage: "이미 로그인이 되어있습니다."});
        // }
        console.log(user);
        const userInfo = await Users.findOne({
            where: {
                nickname,
                password,
            }
        });

        // 입력한 정보가 DB의 내용과 일치하는지 확인.
        if (userInfo === null) {
            throw new Error("nickname 과 password 를 확인해주세요.");
        }

        // token 생성 후 res.cookie.
        const token = jwt.sign({"userId": userInfo.userId}, process.env.TOKENKEY);
        res.cookie("token", token);
        return res.status(200).json({message: " 로그인 성공 !"});
    } catch (err) {
        res.status(400).json({errorMessage: err.message});
    }

});


module.exports = router;