const express = require('express');
const path=require('path');
const fs=require('fs');

const app = express();

const PORT = 3000; // Define your port
// let {tasks}=require('./data/tasks.json');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
    // Send a simple text response
    // res.send('Hello from your Express server!');
    res.sendFile(path.join(__dirname,'public','index.html')); 
});

app.get('/tasks', (req, res) => {
    const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

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


const addRoutes=require('./Routes/add.js');
app.use('/add',addRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    // Log a message to the console when the server starts
    console.log(`Server is running on http://localhost:${PORT}`);
});