const ntBtn = document.getElementById('nt');
ntBtn.onclick = () => {
    window.location.href = '/add';
}

document.addEventListener('DOMContentLoaded', () => {
    const ttElement = document.getElementById('ttno');
    const dtElement = document.getElementById('dtno');
    const tasksContainer = document.querySelector('.tottasks');

    const tasksJsonUrl = '/tasks'; // This is your server-side API endpoint for tasks

    async function fetchAndRenderTasks() { // Made async to use await
        try {
            const res = await fetch(tasksJsonUrl);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            let tasks = data.tasks;

            tasksContainer.innerHTML = ''; // Clear existing tasks
            ttElement.textContent = tasks.length;
            dtElement.textContent = tasks.filter(task => task.done).length;

            if (tasks.length === 0) {
                tasksContainer.innerHTML = '<p>No tasks to display.</p>';
            } else {
                let newID = 1; // Used for display numbering, separate from actual task.id
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    if (task.done) {
                        taskElement.classList.add('task-done');
                    }
                    taskElement.dataset.taskId = task.id; // Store the actual task.id

                    const taskIDDiv = document.createElement('div');
                    taskIDDiv.classList.add('task-id');
                    taskIDDiv.textContent = newID; // Display sequential number
                    newID = newID + 1;

                    const taskContentDiv = document.createElement('div');
                    taskContentDiv.classList.add('task-content');

                    const title = document.createElement('h4');
                    title.textContent = task.taskTitle;
                    title.classList.add('task-title');

                    const desc = document.createElement('p');
                    desc.textContent = task.taskDesc;
                    desc.classList.add('task-description');

                    taskContentDiv.appendChild(title);
                    taskContentDiv.appendChild(desc);

                    const taskActionsDiv = document.createElement('div');
                    taskActionsDiv.classList.add('task-actions');

                    const taskStatusCheckbox = document.createElement('input');
                    taskStatusCheckbox.type = 'checkbox';
                    taskStatusCheckbox.checked = task.done;
                    taskStatusCheckbox.classList.add('task-checkbox');

                    taskStatusCheckbox.addEventListener('change', async (event) => { // Made async
                        const isDone = event.target.checked;
                        const taskId = taskElement.dataset.taskId;

                        try {
                            // Send PUT/PATCH request to update task status
                            const updateRes = await fetch(`/tasks/${taskId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ done: isDone })
                            });
                            
                            if (!updateRes.ok) {
                                throw new Error(`Failed to update task status: ${updateRes.status}`);
                            }

                            // If update is successful, apply visual changes
                            if (isDone) {
                                taskElement.classList.add('task-done');
                                task.done = true; // Update local task object
                            } else {
                                taskElement.classList.remove('task-done');
                                task.done = false; // Update local task object
                            }
                            dtElement.textContent = tasks.filter(t => t.done).length;

                            fetchAndRenderTasks();

                        } catch (error) {
                            console.error('Error updating task status:', error);
                            alert('Failed to update task status. Please try again.');
                            // Revert checkbox state if update failed
                            event.target.checked = !isDone; 
                        }
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-btn');
                    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

                    deleteButton.addEventListener('click', async () => { // Made async
                        const taskId = taskElement.dataset.taskId;

                        try {
                            const deleteRes = await fetch(`${tasksJsonUrl}/${taskId}`, {
                                method: 'DELETE'
                            });

                            if (!deleteRes.ok) {
                                throw new Error(`Failed to delete task: ${deleteRes.status}`);
                            }

                            // If deletion is successful on server, remove from DOM
                            taskElement.remove();

                            // Update local tasks array and counts
                            tasks = tasks.filter(t => t.id !== taskId);
                            ttElement.textContent = tasks.length;
                            dtElement.textContent = tasks.filter(t => t.done).length;

                            if (tasks.length === 0) {
                                tasksContainer.innerHTML = '<p>No tasks to display.</p>';
                            }

                            fetchAndRenderTasks();

                        } catch (error) {
                            console.error('Error deleting task:', error);
                            alert('Failed to delete task. Please try again.');
                        }
                    });

                    taskActionsDiv.appendChild(taskStatusCheckbox);
                    taskActionsDiv.appendChild(deleteButton);

                    taskElement.appendChild(taskIDDiv);
                    taskElement.appendChild(taskContentDiv);
                    taskElement.appendChild(taskActionsDiv);

                    tasksContainer.appendChild(taskElement);
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            tasksContainer.innerHTML = `<p>Failed to load tasks: ${error.message}</p>`;
        }
    }

    fetchAndRenderTasks();
});