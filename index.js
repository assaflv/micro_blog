const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/microblog')
    .then(() => console.log('connected to DB'))
    .catch(err => console.error('can not connect to DB'));

    //blog templete
const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    }
    ,text:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
});

const Blog = mongoose.model('Blog',blogSchema);

const app = express();

app.use(express.json());  

app.get('/',(req,res) =>{
    res.send('Hello World');
});   


//get for all the blogs
app.get('/api/blogs',async (req,res) =>{
    const blogs = await Blog.find();
res.send(blogs);
});   

//get for specific id
app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');
    res.send(blog);
});

//post a new blog
app.post('/api/blogs', async (req,res) => {

    if (!req.body.title || !req.body.text|| !req.body.author) return res.status(400).send("error: missing details");
    
    let blog = new Blog({
        title: req.body.title,
        text: req.body.text,
        author: req.body.author,
    });
    blog = await blog.save();
    res.send(blog);
})

// put exist blog  
app.put('/api/blogs/:id', async (req, res) => {
    if (!req.body.title || !req.body.text || !req.body.author) return res.status(400).send("error: missing details");

    const blog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        text: req.body.text,
        author: req.body.author,
    },
     {new: true});

    if (!blog) return res.status(404).send('Blog not found');

    res.send(blog);
});

// delete exist blog
app.delete('/api/blogs/:id',async (req, res) => {   
    const blog = await Blog.findByIdAndRemove(req.params.id);

    if (!blog) return res.status(404).send('Blog not found');
    res.send(blog);
});

// PORT 

const port = 3000 ; 
app.listen(port,() => console.log('listing on port 3000'))  