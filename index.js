import express from "express";

const app = express();
const port = 3000;
var blogPosts = [];

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const posts = blogPosts;

    res.render("index.ejs", { blogPosts });
})

app.post("/submit", (req, res) => {
    const { title } = req.body;
    blogPosts.push(title);

    res.render("index.ejs", { blogPosts })
})

app.get("/post", (req, res) => {
    res.render('post.ejs');
})

app.listen(port, (req, res) => {
    console.log(`Now listening on port ${port}`);
})