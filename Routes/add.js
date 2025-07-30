const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // <--- ADD THIS LINE

const route = express.Router();
const upload = multer(); // <--- ADD THIS LINE to initialize multer

// Body-parsing middleware is now in server.js, so these are commented out
// route.use(express.urlencoded({ extended: true }));
// route.use(express.json());

route.get('/', (req, res) => {
    console.log('INFO: /add route received a GET request.');
    const filePath = path.join(__dirname, '..', 'public', 'add.html');
    console.log(`INFO: Attempting to send file: ${filePath}`);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('ERROR: Failed to send add.html. Details:', err);
            if (!res.headersSent) {
                res.status(err.status || 500).send('Failed to load add page due to server error.');
            }
        } else {
            console.log('INFO: add.html sent successfully.');
        }
    });
});

// <--- MODIFY THIS LINE: Add upload.none() middleware before your handler function
route.post('/', upload.none(), (req, res) => {
    console.log('INFO: /add route received a POST request.');
    console.log('DEBUG: Request headers Content-Type:', req.headers['content-type']);
    console.log('DEBUG: Value of req.body:', req.body); // This should now be populated!

    const tasksFilePath = path.join(__dirname, '..', 'data', 'tasks.json');

    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('ERROR: Error reading tasks.json for POST:', err);
            return res.status(500).send('Error reading tasks file.');
        }

        let tasksData;
        try {
            tasksData = JSON.parse(data);
        } catch (parseError) {
            console.error('ERROR: Error parsing tasks.json for POST:', parseError);
            return res.status(500).send('Error parsing tasks data.');
        }

        let tasks = tasksData.tasks;
        const newTaskTitle = req.body.TN; // This line should now work correctly
        const newTaskDesc = req.body.TD;   // This line should now work correctly

        if (!newTaskTitle || !newTaskDesc) {
            console.warn('WARNING: Missing task title or description in POST request.');
            return res.status(400).send('Task title and description are required.');
        }

        const newId = tasks.length > 0 
              ? (Math.max(...tasks.map(task => parseInt(task.id))) + 1).toString() 
              : "1";

        const newTask = {
            id: newId,
            taskTitle: newTaskTitle,
            taskDesc: newTaskDesc,
            done: false
        };

        tasks.push(newTask);

        fs.writeFile(tasksFilePath, JSON.stringify(tasksData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('ERROR: Error writing tasks.json for POST:', writeErr);
                return res.status(500).send('Error saving task.');
            }
            console.log('INFO: New task added and saved. Redirecting to /');
            res.redirect('/');
        });
    });
});

module.exports = route;