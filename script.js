let lastDeletedTask = null;

// Add Task
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskDate = document.getElementById("taskDate");
    let taskList = document.getElementById("taskList");

    if (!taskInput.value.trim()) {
        alert("Please enter a task!");
        return;
    }

    let li = document.createElement("li");
    let dueDate = taskDate.value || "No Due Date";
    li.innerHTML = `${taskInput.value} <span class="due-date">${dueDate}</span>`;

    // Mark as complete
    li.onclick = function () {
        this.classList.toggle("completed");
        saveTasks();
    };

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = function () {
        lastDeletedTask = { text: taskInput.value, dueDate, completed: li.classList.contains("completed") };
        li.remove();
        saveTasks();
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    saveTasks();
    taskInput.value = "";
    taskDate.value = "";
}

// Save & Load Tasks
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach((li) => {
        let text = li.childNodes[0].nodeValue.trim();
        let dueDate = li.querySelector(".due-date").textContent;
        tasks.push({ text, dueDate, completed: li.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgressBar();
}

function loadTasks() {
    let taskList = document.getElementById("taskList");
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach((task) => {
        let li = document.createElement("li");
        li.innerHTML = `${task.text} <span class="due-date">${task.dueDate}</span>`;
        if (task.completed) li.classList.add("completed");

        li.onclick = function () {
            this.classList.toggle("completed");
            saveTasks();
        };

        taskList.appendChild(li);
    });

    updateProgressBar();
}

// Clear All Tasks
function clearTasks() {
    document.getElementById("taskList").innerHTML = "";
    localStorage.removeItem("tasks");
}

// Undo Delete
function undoDelete() {
    if (lastDeletedTask) {
        let taskList = document.getElementById("taskList");
        let li = document.createElement("li");
        li.innerHTML = `${lastDeletedTask.text} <span class="due-date">${lastDeletedTask.dueDate}</span>`;
        if (lastDeletedTask.completed) li.classList.add("completed");

        li.onclick = function () {
            this.classList.toggle("completed");
            saveTasks();
        };

        taskList.appendChild(li);
        lastDeletedTask = null;
        saveTasks();
    } else {
        alert("No task to undo!");
    }
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Theme Selector
function changeTheme() {
    let theme = document.getElementById("themeSelector").value;
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}

// Progress Bar
function updateProgressBar() {
    let tasks = document.querySelectorAll("#taskList li");
    let completed = document.querySelectorAll("#taskList li.completed");
    document.getElementById("progress-bar").style.width = tasks.length ? `${(completed.length / tasks.length) * 100}%` : "0%";
}

// Load on startup
window.onload = function () {
    loadTasks();
    if (localStorage.getItem("darkMode") === "true") toggleDarkMode();
    document.getElementById("themeSelector").value = localStorage.getItem("theme") || "light";
};
