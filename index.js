import express from "express";
import fs from 'fs';
import path from 'path';
import { title } from "process";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
var blogPosts = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs", { blogPosts });
})

app.post("/submit", (req, res) => {
    const { title, content } = req.body;

    const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, '');
    const fullTemplate = `
    <html>
        <body>
            <h1>${title}</h1>
            <p>${content}</p>
            <a href="/" style="text-decoration:none;"><button>Home</button></a>
            <a href="/edit/${safeTitle}" style="text-direction:none;"><button>Edit</button>
        </body>
    </html>`;

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
    const { title } = "Post Title";

    res.render('post.ejs', { title });
})

app.get("/posts/:title", (req, res) => {
    const { title } = req.params;
    const filePath = path.join(__dirname, 'views', 'posts', `${title}.ejs`);

    if(!fs.existsSync(filePath)) {
        return res.status(404).send("Post not found");
    }

    res.render(`posts/${title}`);
})

app.get("/edit/:title", (req, res) => {
    const title = req.params.title || "Post Title";
    const index = blogPosts.findIndex(post => post == title);

    if(index != -1) {
        blogPosts.splice(index, 1);
    }

    res.render('post.ejs', { title });
})

app.listen(port, (req, res) => {
    console.log(`Now listening on port ${port}`);
})