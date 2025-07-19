import express from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
var blogPosts = [];

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("index.ejs", { blogPosts });
})

app.post("/submit", (req, res) => {
    const { title, content } = req.body;

    const fullTemplate = `<html><h1><p>${title}</p></h1>${content}</html>`
    const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, '');

    fs.writeFile(`./views/posts/${safeTitle}.ejs`, fullTemplate, err => {
        if(err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Could not create blog post file.');
        }
        
        blogPosts.push(safeTitle);
        res.render("index.ejs", { blogPosts });
    })
})

app.get("/post", (req, res) => {
    res.render('post.ejs');
})

app.get("/posts/:title", (req, res) => {
    const { title } = req.params;
    const filePath = path.join(__dirname, 'views', 'posts', `${title}.ejs`);

    if(!fs.existsSync(filePath)) {
        return res.status(404).send("Post not found");
    }

    res.render(`posts/${title}`);
})

app.listen(port, (req, res) => {
    console.log(`Now listening on port ${port}`);
})