// تحديد العناصر
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const clearAllButton = document.getElementById('clear-all');
const filters = document.querySelectorAll('.filters span');

// تحميل المهام من localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// عرض المهام
function displayTasks(filter = 'all') {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter === 'all' || 
            (filter === 'completed' && task.completed) || 
            (filter === 'pending' && !task.completed)) {
            
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <i class="fas fa-trash delete-btn"></i>
            `;

            // إضافة مستمع حدث للصندوق
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => toggleTask(index));

            // إضافة مستمع حدث لزر الحذف
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        }
    });
    saveTasks();
}

// إضافة مهمة جديدة
function addTask(text) {
    if (text.trim()) {
        tasks.unshift({
            text: text,
            completed: false
        });
        saveTasks();
        displayTasks();
        taskInput.value = '';
    }
}

// حذف مهمة
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// تبديل حالة المهمة (مكتملة/غير مكتملة)
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

// حفظ المهام في localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إضافة مستمعي الأحداث
addButton.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

clearAllButton.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    displayTasks();
});

// مستمعي أحداث التصفية
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        document.querySelector('.filters span.active').classList.remove('active');
        filter.classList.add('active');
        displayTasks(filter.dataset.filter);
    });
});

// عرض المهام عند تحميل الصفحة
displayTasks();
