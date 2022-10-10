const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const {Comments} = require("../models");

// 댓글 생성
router.post("/comments/:postId", authMiddleware, async (req, res, next) => {
    try {
        const {user} = res.locals;
        const {comment} = req.body;
        const {postId} = req.params;

        await Comments.create({
            nickname: user.nickname,
            postId  : postId,
            comment : comment,
        });

        res.json({message: "댓글 완료 !"});
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }
});

// 댓글 수정
router.patch("/comments/:commentId", authMiddleware, async (req, res, next) => {
    try {
        const {commentId} = req.params;
        const {user} = res.locals;
        const {comment} = req.body;

        const commentInfo = await Comments.findOne({
            where: {commentId: commentId},
        })

        if (commentInfo.nickname !== user.nickname) {
            return res.status(401).json({errorMessage: "댓글수정은 작성자 본인만 가능합니다."})
        };

        await Comments.update({comment: comment}, {
            where: {commentId: commentId},
        });

        res.json({message: "댓글 수정 완료 !"})
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }

})

// 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
    const {user} = res.locals;
    const {commentId} = req.params;

    try {
        const commentInfo = await Comments.findOne({
            where: {commentId},
        });

        // 작성자 본인인지 확인
        if (commentInfo.nickname !== user.nickname) {
            return res.status(401).json({errorMessage: "본인이 작성한 댓글만 삭제할 수 있습니다."});
        }

        await Comments.destroy({
            where: {commentId},
        });

        res.json({message: "삭제 완료 !"})
    } catch (err) {
        res.status(500).json({errorMessage: err});
    }
})


module.exports = router;