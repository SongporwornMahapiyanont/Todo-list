console.log('Script loaded!'); // Add this first

const inputElement = document.getElementById('todoInput');
const btnInput = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const list = document.querySelectorAll('list');
const todoCount = document.getElementById('todoCount');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const emptyState = document.getElementById('emptyState');

console.log('Elements found:', inputElement, btnInput); // Check if elements exist

// addContent Function
// Add event listener to the button
btnInput.addEventListener('click', () => {
    console.log('Button clicked!'); // Check if event fires
    // Check if input is empty
    if (inputElement.value.trim() === '') {
        console.log('Input is empty, not adding todo.');
        alert('Please enter a todo item.');
        return; 
    }
    console.log('Adding todo:', inputElement.value); // Log the input value
    
    // Create a new list item
    const li = document.createElement('li')
    li.className = 'todo-item';
    li.textContent = inputElement.value; 
    inputElement.value = ''; // Clear the input field after adding the todo 

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.marginLeft = 'auto'; // Add some space between the text and the button
    deleteBtn.addEventListener('click',(event)=>{
        event.stopPropagation(); // Stop the click event from bubbling up to the li
        // Handle delete button click
        console.log('Delete button clicked for:', li.textContent);
        todoList.removeChild(li); // Remove the todo item
        updateTodoCount(); // Update the todo count after deletion
        const remainingTodos = todoList.querySelectorAll('.todo-item').length;
        const emptyParagraph = emptyState.querySelector('p');
        if (remainingTodos === 0 && !emptyParagraph) {
            const p = document.createElement('p');
            p.textContent = 'No todos yet. Add your first todo!';
            emptyState.appendChild(p);
            console.log('No todos left, showing empty state');
        }
        // After deleting a todo
        updateTodoCount();
        saveTodoToLocalStorage();
    })
    li.appendChild(deleteBtn);

    li.addEventListener('click', () => {
        console.log('Todo item clicked:', li.textContent);
        li.classList.toggle('completed'); // Toggle from todo-item to be todo-item.completed 
        // After toggling completed
        updateTodoCount();
        saveTodoToLocalStorage();
    });
    todoList.appendChild(li);

    // Remove the <p> inside emptyState if it exists (when adding a todo)
    const emptyParagraph = emptyState.querySelector('p');
    if (emptyParagraph) {
        emptyState.removeChild(emptyParagraph);
    }

    li.addEventListener('dblclick', () => {
        const newValue = prompt('Edit your todo:', li.childNodes[0].textContent.trim());
        if (newValue !== null && newValue.trim() !== '') {
            console.log('Editing todo:', li.textContent, 'to', newValue);
            li.childNodes[0].textContent = newValue.trim();
        }

        // Remove the <p> inside emptyState if it exists
        const emptyParagraph = emptyState.querySelector('p');
        if (todoList.querySelectorAll('.todo-item').length > 0) {
            if (emptyParagraph) {
                console.log('Removing empty state paragraph');
                emptyState.removeChild(emptyParagraph);
            }
        }

        // After editing a todo
        updateTodoCount();
        saveTodoToLocalStorage();
    });

    // After adding a todo
    updateTodoCount();
    saveTodoToLocalStorage();
});

// Delete All Button Functionality
deleteAllBtn.addEventListener('click', () => {
    console.log('Delete All button clicked'); // Log the button click
    todoList.innerHTML = ''; // Clear the todo list
    updateTodoCount(); // Update the todo count after clearing the list
    let emptyParagraph = emptyState.querySelector('p');
    if (!emptyParagraph) {
            const p = document.createElement('p');
            p.textContent = 'No todos yet. Add your first todo!';
            emptyState.appendChild(p);
            console.log('No todos yet, showing empty state');
        }
});

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        btnInput.click();
    }
});

function updateTodoCount() {
    const count = todoList.querySelectorAll('.todo-item').length;
    todoCount.textContent = `Total Todos: ${count}`;
    console.log('Todo count updated:', count); // Log the updated count
}


function saveTodoToLocalStorage(){
    const todos = [];
    todoList.querySelectorAll('.todo-item').forEach(item => {
        todos.push({
            text:item.childNodes[0].textContent.trim(),
            complete : item.classList.contains('completed')
        })
    });
    localStorage.setItem('todos',JSON.stringify(todos)); // Save todos to localStorage by converting the array to a JSON string
    console.log('Todos saved to localStorage:', todos); // Log the saved todos
}

function loadTodoListFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || []; // parse the todos from localStorage or use an empty array if none exist

    // Localstroage includes information kind of JSON format but DOM must utilize HTML elements (createElement,appendChild, etc.)
    console.log('Loaded todos from localStorage:', todos); // Log the loaded todos


    // add information to All todo list
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.textContent = todo.text;

        if (todo.complete) {
            li.classList.add('completed');
        }

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.marginLeft = 'auto';
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            todoList.removeChild(li);
            updateTodoCount();
            saveTodoToLocalStorage();
            const remainingTodos = todoList.querySelectorAll('.todo-item').length;
            const emptyParagraph = emptyState.querySelector('p');
            if (remainingTodos === 0 && !emptyParagraph) {
                const p = document.createElement('p');
                p.textContent = 'No todos yet. Add your first todo!';
                emptyState.appendChild(p);
            }
        });
        li.appendChild(deleteBtn);

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateTodoCount();
            saveTodoToLocalStorage();
        });

        li.addEventListener('dblclick', () => {
            const newValue = prompt('Edit your todo:', li.childNodes[0].textContent.trim());
            if (newValue !== null && newValue.trim() !== '') {
                li.childNodes[0].textContent = newValue.trim();
                updateTodoCount();
                saveTodoToLocalStorage();
            }
        });

        todoList.appendChild(li);
    });
    updateTodoCount();
}

// Load todos from localStorage on initial load
document.addEventListener('DOMContentLoaded', () => {
    loadTodoListFromLocalStorage();

    let emptyParagraph = emptyState.querySelector('p');
    if (!emptyParagraph && todoList.querySelectorAll('.todo-item').length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No todos yet. Add your first todo!';
        emptyState.appendChild(p);
    }
});
