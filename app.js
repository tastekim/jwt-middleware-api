const express = require("express");
const app = express();
const {Op} = require("sequelize");
const bodyParser = require("body-parser");
const Sign = require("./services/sign");
const Posts = require("./services/posts");
const Comments = require("./services/comments");
const cookieParser = require("cookie-parser");
const Likes = require("./services/likes");
const path = require("path");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use([Sign, Posts, Comments, Likes]);


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../4w-prac/assets", "post.html"))
})


app.listen(3000, "127.0.0.1", () => {
    console.log("Server running on port 3000");
});
