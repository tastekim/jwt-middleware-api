module.exports = (req, res, next) => {
    const authorization = req.cookies.token;

    try {
        if (authorization) {
            res.status(401).json({
                errorMessage: "이미 로그인이 되어있습니다.",
            });
            return;
        }
        next();
    } catch (err) {
        res.status(401).json({
            errorMessage: "로그인 후 이용이 가능합니다.",
        });
    }
};