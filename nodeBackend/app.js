const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');

const mongoose=require('mongoose');
const Post = require('./models/post');
mongoose.connect("mongodb://localhost:27017/blogPostsSite",{useNewUrlParser:true})
  .then(()=>{
    console.log('Connected to DB');
  })
  .catch(()=>{
    console.log('Connection Failed');
  });

const app=express();

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
//extra line for to show body parser can also parse url encoded data
// app.use(bodyParser.urlencoded({extended:false}));

// app.use((req,res,next)=>{ //next() will continue its journey and the next app.use/code will be executed
//   console.log('First Middleware');
//   next();
// });

// app.use((req,res)=>{
//   res.send('Hello from express!');
// });

  app.post("/api/posts",(req,res,next)=>{
    const post=new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save(); // mongoose schema object has an in built function save() that saves the incoming inputs to the mongodb db collection with autogenerated id

    // console.log(post);
    // res.status(201).json({message:'Post Recorded'}); //201 everything is ok and 'resource is created'
  });

app.use('/api/posts',(req,res,next)=>{ //using /api just to denote that this is a REST API. but its optional
  // mongoose schema object also provides method to find/fetch the posts
  Post.find().then((fetchedPostsFromDB)=>{
    // it is important to have the below lines of code inside the then function becuase find() is an
    // asynchronous fuction and it thus wont wait until the then fuction is completely executed and will go to execute statements ahead of it
    // if the below lines were not in then fuction then not all posts would have been fetched.
    // res.json(posts); simply send posts
    // send complex response and also a successful status code 200
    res.status(200).json({
      message:'Retrival Successful',
      posts:fetchedPostsFromDB
    });
  });
});


//to bind this express app to the node server so as to use and execute all these functionalities
//in nodejs server we export this as a module and import in server.js
module.exports=app;

