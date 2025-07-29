const express = require('express');
const path=require('path');
const route = express.Router();

route.use(express.static(path.join(__dirname,'public')));

route.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','add.html'));
})

// route.post('/',(req,res)=>{

// });
module.exports=route;