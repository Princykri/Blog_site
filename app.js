import express from "express"
import bodyParser from "body-parser"
import _ from "lodash";
import mongoose from "mongoose"

const port =process.env.PORT || 3030;

const mongodb="mongodb+srv://princyk2007:qwerty1234@cluster0.y4nrtd9.mongodb.net/PostDB"

mongoose.connect(mongodb)
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log(err);
})

const postSchema={
    Title:{
        type:"String",
        required:true
    },
    Content:{
        type:"String",
        required:true
    }
}

const Post=mongoose.model("Post",postSchema);

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",(req,res)=>{
    Post.find()
    .then((foundPost)=>{
        res.render("home",{posts:foundPost});
    })
    .catch((err)=>{
        console.log(err);
    })
   
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/compose",(req,res)=>{
    res.render("compose")
})

app.post("/compose",(req,res)=>{
    const Title=_.capitalize(req.body.postTitle);
    const Content=_.capitalize(req.body.postBody);

    const newpost=new Post({
         Title:Title,
         Content:Content
    })
    newpost.save();
    res.redirect("/");
})

app.get("/posts/:postName",(req,res)=>{
    const reqTitle= req.params.postName;
   
    Post.findOne({Title:reqTitle})
    .then(function(foundpost){
        
        res.render("post",{
            Title:foundpost.Title,
            Content:foundpost.Content
        })
    })
    .catch((err)=>{
        console.log(err);
    })

})




app.listen(port,()=>{
    console.log("Server is Running")
})