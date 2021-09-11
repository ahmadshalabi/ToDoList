let ToDoListApp = (function () {

    function Element(identifier, element, listener) {
        this.identifier = identifier;
        this.element = element;
        this.listener = listener;
    }

    const Listeners = (function () {
        function addTask() {
            const taskName = elements.inputTask.element.value;
            if (taskName !== "") {

                const task = {
                    id: uuidv4(),
                    name: taskName,
                    isCompleted: false,
                }

                renderTask(task);

                TaskListLocalStorage.add(task);
            }
        }

        function removeParentElement(event) {
            const taskContainer = event.target.parentElement;
            taskContainer.remove();

            TaskListLocalStorage.remove(taskContainer.dataset.id);
        }

        function toggleTask(event) {
            const taskContainer = event.target.parentElement;
            const taskName = taskContainer.querySelector(`.${elements.task.identifier}`);
            taskName.classList.toggle("completed");

            TaskListLocalStorage.toggleIsComplete(taskContainer.dataset.id);
        }

        return {
            addTask: addTask,
            removeParentElement: removeParentElement,
            toggleTask: toggleTask
        }
    })();

    this.elements = {
        inputTask: new Element("input-task"),
        addTaskButton: new Element("add-task-button", null, Listeners.addTask),
        taskList: new Element("task-list"),
        taskContainer: new Element("task-container", function (task) {
            const taskContainer = document.createElement("li");
            taskContainer.className = this.identifier;
            taskContainer.dataset.id = task.id;
            const isTaskCompleted = task.isCompleted;
            taskContainer.innerHTML = `<input class="task-checkbox" type="checkbox"">
                                        <span class="task ${isTaskCompleted ? "completed" : ""}">${task.name}</span>
                                        <button class="delete-btn"></button>`

            const deleteButton = taskContainer.querySelector(`.${elements.deleteButton.identifier}`);
            deleteButton.addEventListener("click", elements.deleteButton.listener);

            const taskCheckbox = taskContainer.querySelector(`.${elements.taskCheckbox.identifier}`);
            taskCheckbox.checked = isTaskCompleted;
            taskCheckbox.addEventListener("click", Listeners.toggleTask);
            return taskContainer;
        }),
        task: new Element("task"),
        taskCheckbox: new Element("task-checkbox", null, Listeners.toggleTask),
        deleteButton: new Element("delete-btn", null, Listeners.removeParentElement),
    }

    const TaskListLocalStorage = (function () {
        const STORAGE_KEY = "tasks";
        const taskList = new Map(JSON.parse(localStorage.getItem(STORAGE_KEY)));

        function add(task) {
            taskList.set(task.id, task);
            save();
        }

        function toggleIsComplete(uuid) {
            const task = taskList.get(uuid);
            task.isCompleted = !task.isCompleted;
            save();
        }

        function remove(uuid) {
            taskList.delete(uuid);
            save();
        }

        function save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(taskList.entries())));
        }

        function load() {
            return taskList.values();
        }

        return {
            add: add,
            toggleIsComplete: toggleIsComplete,
            remove: remove,
            load: load,
        }
    })();

    function init() {
        elements.inputTask.element = document.getElementById(elements.inputTask.identifier);
        elements.addTaskButton.element = document.getElementById(elements.addTaskButton.identifier);
        elements.taskList.element = document.getElementById(elements.taskList.identifier);

        elements.addTaskButton.element.addEventListener("click", elements.addTaskButton.listener);
        loadAndRenderTasks();
    }

    function loadAndRenderTasks() {
        const taskList = TaskListLocalStorage.load();
        for (const task of taskList) {
            renderTask(task);
        }
    }

    function renderTask(task) {
        const taskContainer = elements.taskContainer.element(task);
        const taskList = elements.taskList.element;
        taskList.appendChild(taskContainer);
    }

    return {
        init: init,
    }
})();

ToDoListApp.init();