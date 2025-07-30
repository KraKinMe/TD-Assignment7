document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the SAVE TASK button
    const saveTaskBtn = document.getElementById('nt');
    // Get a reference to the form
    const form = document.querySelector('form'); // Selects the first form on the page

    // Add a click event listener to the button
    saveTaskBtn.addEventListener('click', async (event) => {
        // Prevent the default form submission (important since the button is outside the form by default)
        event.preventDefault();

        // Get values from the input fields
        const taskNameInput = document.getElementById('TN');
        const taskDescInput = document.getElementById('TD');

        const taskName = taskNameInput.value.trim();
        const taskDesc = taskDescInput.value.trim();

        // Basic validation
        if (!taskName || !taskDesc) {
            alert('Please fill in both the Task Name and Describe Task fields.');
            return;
        }

        // Create a FormData object from the form
        // This automatically handles encoding the data as x-www-form-urlencoded
        const formData = new FormData(form);

        try {
            // Send a POST request to the /add endpoint
            const response = await fetch('/add', {
                method: 'POST',
                body: formData // Use FormData object as the body
            });

            // Check if the response was successful (e.g., 2xx status code)
            if (response.ok) {
                // If the server redirected, the browser will follow it automatically.
                // If you want to explicitly redirect on the client-side, you can do:
                window.location.href = '/'; // Redirect to the homepage
            } else {
                const errorMessage = await response.text(); // Get error message from server
                alert(`Failed to save task: ${errorMessage || response.statusText}`);
                console.error('Server response not OK:', response.status, errorMessage);
            }
        } catch (error) {
            // Catch network errors or other issues with the fetch request
            console.error('Error sending task data:', error);
            alert('An error occurred while trying to save the task. Please try again.');
        }
    });
});