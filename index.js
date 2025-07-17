import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const posts = ['Blog 1', 'Blog 2', 'Blog 3'];

    res.render("index.ejs", { posts });
})

app.listen(port, (req, res) => {
    console.log(`Now listening on port ${port}`);
})