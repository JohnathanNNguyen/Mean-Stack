//this syntax below is how you import files in a js file the property inside the quotation marks is the package required for the import
const express = require("express");
//to download the package for body-parser use
//npm install --save body parser
const bodyParser = require("body-parser");
//connect to mongoose first import it to your backend them look down where we connect it
const mongoose = require("mongoose");

//import post model don't include the extension
const Post = require("./models/post");
const Secrets = require("../.secret/.secret");

const app = express();
//this is where you connect mongoose/ you can get this string from mongoose.com when you connect to application in the cluster remember there will be a spot for your password in the link replace the whole <PASSWORD> including the <> this will return a promise
mongoose
  .connect(
    Secrets.MongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
    //I needed to add the two options up above to get rid of errors
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection Failed");
  });
// mongoose.set("useUnifiedTopology", true);

//using body-parser
app.use(bodyParser.json());
//we don't need this but it can do the method below
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    //201 means everything is okay a new resource was created
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  //Post.find will return all the data
  Post.find().then((documents) => {
    //200 means everything is okay
    res.status(200).json({
      message: "Post fetched successfully!",
      posts: documents,
    });
  });
});
//here we will dynamically change the id ->   req.params.id
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;

// mondoDB:   h2nSav2R26EPcRt

// /usr/local/Cellar/mongodb-community-shell/4.2.0
