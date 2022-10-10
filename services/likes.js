const express = require("express");
const router = express.Router();
const {Likes, Posts} = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const checkLike = require("../middlewares/check-like");
const {Op} = require("sequelize");

// 좋아요 누르기 -> checkLike 미들웨어에서 확인.
router.get("/likes/:postId", authMiddleware, checkLike, async (req, res) => {
    res.json({});
});

// 좋아요를 누른 게시글 찾기.
router.get("/likes", authMiddleware, async (req, res) => {
    const {user} = res.locals;
    try {
        // Likes 테이블에서 유저의 아이디로 좋아요를 누른 postId 찾기.
        const likePostId = await Likes.findAll({
                where     : {
                    userId: user.userId,
                },
                attributes: ["postId"],
            }
        );

        // 찾은 목록에서 postId 만을 담은 배열로 변환.
        const likeArr = likePostId.map((likePost) => {
            return likePost.getDataValue("postId")
        })

        // Posts 테이블에서 likeArr 에 있는 값이랑 postId 랑 매치되는 글 찾기.
        const likePost = await Posts.findAll({
            where: { postId: { [Op.in]: likeArr } },
            order     : [["createdAt", "DESC"]],
        });

        res.json(likePost);
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }


});

module.exports = router;