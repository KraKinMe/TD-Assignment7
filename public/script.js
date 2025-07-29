const ntBtn=document.getElementById('nt');
ntBtn.onclick=()=>{
    window.location.href='/add';
}

document.addEventListener('DOMContentLoaded',()=>{
    const ttElement=document.getElementById('ttno');
    const dtElement=document.getElementById('dtno');
    const tasksContainer=document.querySelector('.tottasks');

    const tasksJsonUrl='./data/tasks.json';

    function fetchAndRenderTasks(){
        fetch(tasksJsonUrl)
            .then((res)=>{
                if(!res.ok){
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data=>{
                const tasks=data.tasks;
                tasksContainer.innerHTML='';
                ttElement.textContent=tasks.length;
                dtElement.textContent=tasks.filter(task=>task.done).length;
    
                if(tasks.length===0){
                    tasksContainer.innerHTML='<p>No tasks to display.</p>'
                }
                else{
                    tasks.forEach(task=>{
                        const taskElement=document.createElement('div');
                        taskElement.classList.add('task');
                        if(task.done){
                            taskElement.classList.add('task-done');
                        }
                        taskElement.dataset.taskId=task.id;
    
                        const taskIDDiv=document.createElement('div');
                        taskIDDiv.classList.add('task-id');
                        taskIDDiv.textContent=task.id;
    
                        const taskContentDiv=document.createElement('div');
                        taskContentDiv.classList.add('task-content');
    
                        const title=document.createElement('h4');
                        title.textContent=task.taskTitle;
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
    
                        taskStatusCheckbox.addEventListener('change',(event)=>{
                            if(event.target.checked){
                                taskElement.classList.add('task-done');
                                task.done=true;
                            }
                            else{
                                taskElement.classList.remove('task-done');
                                task.done=false;
                            }
    
                            doneTasksElement.textContent=tasks.filter(t=>t.done).length;
                        });
    
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete-btn');
                        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    
                        deleteButton.addEventListener('click', () => {
                            taskElement.remove(); // Remove task from DOM
    
                                // Update local tasks array (optional, for immediate counts update)
                            tasks = tasks.filter(t => t.id !== task.id);
                            totalTasksElement.textContent = tasks.length;
                            const currentDoneTasksCount = tasks.filter(t => t.done).length;
                            doneTasksElement.textContent = currentDoneTasksCount;
                                
                            if (tasks.length === 0) {
                                tasksContainer.innerHTML = '<p>No tasks to display.</p>';
                            }
    
                                
                        });
                    })
                }
            })
            .catch(error=>{
                console.error('Error fetching tasks:', error);
                tasksContainer.innerHTML = `<p>Failed to load tasks: ${error.message}</p>`;
            });
    }

    fetchAndRenderTasks();

});