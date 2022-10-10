const {Likes} = require("../models");

module.exports = async (req, res, next) => {
        const {user} = res.locals;
        const {postId} = req.params;

        const likeInfo = await Likes.findOne({
            where: {
                postId: postId,
                userId: user.userId
            }
        });

        if (likeInfo === null) {
            await Likes.create({
                postId: postId,
                userId: user.userId
            });
            next();
        } else {
            await Likes.destroy({
                where: {
                    postId: postId,
                    userId: user.userId
                }
            });
            next();
        }
};