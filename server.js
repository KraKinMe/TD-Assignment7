const express = require('express');
const path=require('path');
const app = express();

const PORT = 3000; // Define your port
let {tasks}=require('./data/tasks.json');

app.use(express.static(path.join(__dirname,'public')));

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
    // Send a simple text response
    // res.send('Hello from your Express server!');
    res.sendFile(path.join(__dirname,'public','index.html')); 
});


const addRoutes=require('./Routes/add.js');
app.use('/add',addRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    // Log a message to the console when the server starts
    console.log(`Server is running on http://localhost:${PORT}`);
});