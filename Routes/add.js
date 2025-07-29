const express = require('express');
const path=require('path');
const fs=require('fs');
const { error } = require('console');

const route = express.Router();

route.use(express.urlencoded({extended:true}));
route.use(express.json);

route.use(express.static(path.join(__dirname,'public')));

route.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','add.html'));
});

route.post('/',(req,res)=>{
    const tasksFilePath=path.join(__dirname,'..','data','tasks.json');
    fs.readFile(tasksFilePath,'utf-8',(err,data)=>{
        if(err){
            console.error('Error in tasks.json: ',err);
            return res.status(500).send('Error in reading tasks');
        }

        let tasksData;
        try{
            tasksData=JSON.parse(data);
        }
        catch(parseError){
            console.error('Error parsing tasks.json', parseError);
            return res.status(500).send('Error parsing tasks data');
        }

        const tasks=tasksData.tasks;

        const TN=req.body.TN;
        const TD=req.body.TD;

        if(!TN || !TD){
            return res.status(400).send('Task title and desc. are req');
        }

        const newId=tasks.length+1;

        const newTask={
            id:newId,
            taskTitle:TN,
            taskDesc:TD,
            done:false
        };

        tasks.push(newTask);

        fs.writeFile(tasksFilePath,JSON.stringify(tasksData,null,2),'utf8',(writeErr)=>{
            if(writeErr){
                console.error('Error writing:  ',writeErr);
                return res.status(500).send('Error saving task');
            }
            res.redirect('/');
        })
    });
});
module.exports=route;