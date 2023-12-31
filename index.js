//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/blogDB");

const connectDB = async ()=>{
  try{
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
  } catch(error){
      console.log(error);
  }
}

const postSchema = mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema);

//let posts=[];

app.get("/", function(req, res){
  
  Post.find({}).then(function(foundPosts){
    res.render("home", {homeStartingContent:homeStartingContent, posts:foundPosts, _: _});
  }).catch(function(err){
    console.log(err);
  })
  
})

app.get("/about", function(reqq, ress){
  ress.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(reqqq, resss){
  resss.render("contract", {contactContent: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.get("/posts/:topic", function(req, res){
  Post.find({}).then(function(foundPosts){
    foundPosts.forEach(function(element){
      if(_.lowerCase(element.title) === _.lowerCase(req.params.topic)){
        // console.log("Match Found!");
        res.render("post", {post: element});
        
      }
  })
  
  }).catch(function(err){
    console.log(err);
  })
})

app.post("/compose", function(request, response){
  // const post = {title : request.body.postTitle,
  //             content : request.body.postBody};

  const post = new Post({title: request.body.postTitle,
                content: request.body.postBody});
  //posts.push(post);
  // console.log(posts);
  post.save().then(()=>{
    response.redirect("/");
  }).catch((err)=>{
    console.log(err);
  })
  
  
})


let port = process.env.PORT;
if(port == null || port ==""){
    port = 3000;
}

connectDB().then(()=>{
  app.listen(port, function() {
    console.log("Server running successfully");
  });
})


