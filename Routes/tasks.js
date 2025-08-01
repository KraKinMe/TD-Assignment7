const express=require('express');
const path=require('path');
const fs=require('fs');

const router=express.Router();

const tasksFilePath = path.join(__dirname,'..','data', 'tasks.json');

router.get('/',(req,res)=>{
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks.json for /tasks endpoint:', err);
            // If the file doesn't exist or is unreadable, send an empty array or an error
            return res.status(500).json({ tasks: [], error: 'Failed to load tasks.' });
        }
        try {
            const tasksData = JSON.parse(data);
            res.json({ tasks: tasksData.tasks });
        } catch (parseError) {
            console.error('Error parsing tasks.json for /tasks endpoint:', parseError);
            return res.status(500).json({ tasks: [], error: 'Failed to parse tasks data.' });
        }
    });
});

router.delete('/:id',(req,res)=>{
    fs.readFile(tasksFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({ tasks: [], error: 'Failed to get tasks' });
        }
        let tasksData;
        try{
            tasksData=JSON.parse(data);
            // I will get tasks as JSON
        }
        catch(parseError){
            console.error('ERROR: Error parsing tasks.json for delete:', parseError);
            return res.status(500).send('Error parsing tasks data.');
        }

        let tasks=tasksData.tasks;
        const oldLen=tasks.length;
        //COMPLETE TASKS ARRAY

        const Did=req.params.id;

        tasksData.tasks=tasks.filter((task)=>{
            return task.id!==Did;
        });

        if(tasksData.tasks.length===oldLen){
            return res.status(404).json({message:'Task Not Found'});
        }

        fs.writeFile(tasksFilePath,JSON.stringify(tasksData,null,2),'utf-8',(writeErr)=>{
            if(writeErr){
                console.error('ERROR: Error writing tasks.json after DELETE:', writeErr);
                return res.status(500).json({ error: 'Error saving updated tasks.' });
            }

            console.log(`INFO: Task with ID ${Did} deleted successfully.`);
            res.status(200).json({ message: 'Task deleted successfully.' });
        })
    })
});

router.patch('/:id',(req,res)=>{
    fs.readFile(tasksFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({ tasks: [], error: 'Failed to get tasks' });
        }
        let tasksData;
        try{
            tasksData=JSON.parse(data);
            // I will get tasks as JSON
        }
        catch(parseError){
            console.error('ERROR: Error parsing tasks.json for patch:', parseError);
            return res.status(500).send('Error parsing tasks data.');
        }

        let tasks=tasksData.tasks;

        const Did=req.params.id;
        const newStatus=req.body.done;

        let changeOccured=false;

        tasks.forEach((each)=>{
            if(each.id===Did){
                each.done=newStatus;
                changeOccured=true;
            }
        });

        if(!changeOccured){
            console.warn(`WARNING: Task with ID ${Did} not found for PATCH update.`);
            return res.status(404).json({ message: 'Task not found.' });
        }

        fs.writeFile(tasksFilePath,JSON.stringify(tasksData,null,2),'utf8',(writeErr)=>{
            if(writeErr){
                console.error('ERROR: Error writing tasks.json after PATCH:', writeErr);
                return res.status(500).json({ error: 'Error saving updated task status.' });
            }
            console.log(`INFO: Task with ID ${Did} updated successfully.`);
            res.status(200).json({ message: 'Task status updated successfully.' });
        });
    })
});

module.exports=router;