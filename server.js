const express = require('express');
var fs = require('fs');
const app =express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 4500;

app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res){
    res.send("hello")
})

app.get("/jim",function(req,res){
    res.send("Ithe enti")
})

app.post("/addStudent",function(req,res){
    console.log(req.body)
    fs.readFile("students.txt",function(err,data){
        var students = JSON.parse(data);
        students.push(req.body);
        fs.writeFile('students.txt', JSON.stringify(students), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })
    
    res.send("Wait man")
})

app.get("/getStudentDetails/:fn",function(req,res){
    console.log(req.params)
    fs.readFile("students.txt",function(err,data){
        data = JSON.parse(data);
        res.send(data.find((student)=>{
            if(student.firstname===req.params.fn){
                return true
            }
        }))
    })
})

app.get("/allStudents",function(req,res){
    fs.readFile("students.txt",function(err,data){
        data = JSON.parse(data);        
        res.send(data)
    })
    
})

// app.get("/getStudentDetails",function(req,res){
//     console.log(req.query)
//     fs.readFile("students.txt",function(err,data){
//         data = JSON.parse(data);
//         res.send(data.find((student)=>{
//             if(student.firstname===req.query.firstname){
//                 return true
//             }
//         }))
//     })
//     // res.send("OK wait")
// })
app.listen(port)

