var express = require('express');
var app=express();
var cors = require('cors');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
app.use(cookieParser("asdasd"));
app.use(cors());
app.set("view engine","ejs");
var bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.post("/login",(req,res)=>{
    console.log(req.body);
    MongoClient.connect("mongodb://127.0.0.1:27017",function(err,con){
        if(err){
            console.log("Error:::",err)
        }
        else{
            var ctsdb = con.db("cts");
            ctsdb.collection("myusers")
            .find({username:req.body.username,password:req.body.password})
            .toArray(function(err,data){
                if(err){
                    console.log("Error",err)
                }
                else{
                    if(data.length===0){
                        res.send({message:"failed"})
                    }
                    else{
                        const token = jwt.sign(req.body,'may be its a secret');                       
                        res.send({message:"passed",token})
                    }
                    // res.render("pages/Orders",{orders:data})
                }
            })
        }
    })
})
app.use(function(req,res,next){
    console.log("Request arrived",req.headers)
    var decodedMSg=jwt.verify(req.headers.authorization,'may be its a secret')
    // console.log(decodedMSg)
    // res.send({message:'plz wait'})
    next();
})
app.get("/orders",(req,res)=>{
    console.log("Orders end point")
    MongoClient.connect("mongodb://127.0.0.1:27017",function(err,con){
        if(err){
            console.log("Error:::",err)
        }
        else{
            var ctsdb = con.db("cts");
            ctsdb.collection("orders").find({}).toArray(function(err,data){
                if(err){
                    console.log("Error",err)
                }
                else{
                    res.json(data)
                    // res.render("pages/Orders",{orders:data})
                }
            })
        }
    })
})
//
app.delete("/deleteOrder/:id",function(req,res){
    // console.log("req.params",typeof parseInt(req.params.id))
    MongoClient.connect("mongodb://127.0.0.1:27017",function(err,con){
        if(err){
            console.log("Error:::",err)
        }
        else{
            var ctsdb = con.db("cts");
            ctsdb.collection("orders").findOneAndDelete({'_id':ObjectId(req.params.id)},function(err,data){
                if(err){
                    console.log("Error",err)
                }
                else{
                    console.log(data)
                    res.json({message:data})
                    // res.render("pages/Orders",{orders:data})
                }
            })
        }
    })
})
app.post("/addOrder",(req,res)=>{
     // console.log("req.params",typeof parseInt(req.params.id))
     MongoClient.connect("mongodb://127.0.0.1:27017",function(err,con){
        if(err){
            console.log("Error:::",err)
        }
        else{
            var ctsdb = con.db("cts");
            ctsdb.collection("orders").insertOne(req.body,function(err,data){
                if(err){
                    console.log("Error",err)
                }
                else{
                    console.log(data)
                    res.json({message:data})
                    // res.render("pages/Orders",{orders:data})
                }
            })
        }
    })
})
app.put("/updateOrder/:id",(req,res)=>{
    // console.log("req.params",typeof parseInt(req.params.id))
    MongoClient.connect("mongodb://127.0.0.1:27017",function(err,con){
       if(err){
           console.log("Error:::",err)
       }
       else{
           var ctsdb = con.db("cts");
           console.log("req.body::",req.body)
           ctsdb.collection("orders").findOneAndUpdate({'_id':ObjectId(req.params.id)},{$set:
                {
                    "cust_id":req.body['cust_id'],
                    "price":req.body['price']
                }
            },function(err,data){
               if(err){
                   console.log("Error",err)
               }
               else{
                   console.log(data)
                   res.json({message:data})
                   // res.render("pages/Orders",{orders:data})
               }
           })
       }
   })
})
app.get("/abc",(req,res)=>{
    res.render("pages/index")
})
app.get("/home",(req,res)=>{
    res.render("home",{firstname:'himagirish'})
});
app.listen(3400,()=>{console.log("Server running on 3400")})