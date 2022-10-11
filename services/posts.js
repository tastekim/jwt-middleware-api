const express = require("express");
const router = express.Router();
const {Posts, Comments, Likes} = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        const {title, content} = req.body;

        if (content === "" || title === "") {
            throw new Error("빈 내용은 입력할 수 없습니다.")
        }

        const post = await Posts.create({
            nickname: user.nickname,
            title   : title,
            content : content
        });

        res.json(post);
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }

});

// 전체 글 조회
router.get("/posts", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            where     : {},
            order     : [["createdAt", "DESC"]], // DESC : 내림차순, ASC : 오름차순
            attributes: ["postId", "title", "nickname", "content", "createdAt", "updatedAt"],
        });

        res.json(posts);
    } catch (err) {
        res.status(500).json({errorMessage: "GET posts 에러"});
    }
});

// 특정 글 조회
router.get("/posts/:postId", async (req, res) => {
    try {
        const {postId} = req.params;

        const post = await Posts.findOne({
            where: {postId},
        });

        const comments = await Comments.findAll({
            where     : {postId: postId},
            order     : [["createdAt", "DESC"]],
            attributes: ["commentId", "postId", "nickname", "comment", "createdAt", "updatedAt"]
        });

        const likecount = await Likes.findAll({
            where: {
                postId: postId,
            }
        });


        res.json({post: post, comments: comments, likes: likecount});
    } catch (err) {
        res.status(500).json({errorMessage: "GET posts 에러"});
    }

});


// 게시글 수정
router.patch("/posts/:postId", authMiddleware, async (req, res) => {
    const {user} = res.locals;
    const {postId} = req.params;
    const {content, password} = req.body;

    try {
        const postInfo = await Posts.findOne({
            where: {postId},
        });

        // 작성자 본인인지 확인
        if (postInfo.nickname !== user.nickname) {
            return res.status(401).json({errorMessage: "본인이 작성한 글만 수정할 수 있습니다."});
        }

        // 계정 비밀번호 확인
        if (user.password !== password) {
            return res.status(401).json({errorMessage: "Password 를 확인해주세요."});
        }

        await Posts.update({content: content}, {
            where: {postId},
        });

        res.json({message: "수정 완료 !"});
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }
});

// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const {user} = res.locals;
    const {postId} = req.params;
    const {password} = req.body;

    try {
        const postInfo = await Posts.findOne({
            where: {postId},
        });

        // 작성자 본인인지 확인
        if (postInfo.nickname !== user.nickname) {
            return res.status(401).json({errorMessage: "본인이 작성한 글만 삭제할 수 있습니다."});
        }

        // 계정 비밀번호 확인
        if (user.password !== password) {
            return res.status(401).json({errorMessage: "Password 를 확인해주세요."});
        }

        await Posts.destroy({
            where: {postId},
        });

        res.json({message: "삭제 완료 !"});
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }

});


module.exports = router;