let ToDoListApp = (function () {

    function Element(identifier, element, listener) {
        this.identifier = identifier;
        this.element = element;
        this.listener = listener;
    }

    let listeners = {
        addTask: function () {
            const taskName = elements.inputTask.element.value;
            if (taskName === "") {
                return;
            }
            let taskContainer = elements.taskContainer.element(taskName);
            const taskList = elements.taskList.element;
            taskList.appendChild(taskContainer);
        },
        removeParentElement: function (event) {
            event.target.parentElement.remove();
        }
    }

    let elements = {
        inputTask: new Element("input-task"),
        addTaskButton: new Element("add-task-button", null, listeners.addTask),
        taskList: new Element("task-list"),
        deleteButtons: new Element("delete-btn", null, listeners.removeParentElement),
        taskContainer: new Element("task-container", createTaskContainerElement),
    }

    function createTaskContainerElement(taskName) {
        const taskContainer = document.createElement("li");
        taskContainer.className = this.identifier;
        taskContainer.innerHTML = `<input class="checkbox" type="checkbox">
                                        <span class="task">${taskName}</span>
                                        <button class="delete-btn"></button>`
        const deleteButton = taskContainer.querySelector(`.${elements.deleteButtons.identifier}`);
        deleteButton.addEventListener("click", elements.deleteButtons.listener);
        return taskContainer;
    }

    function init() {
        elements.inputTask.element = document.getElementById(elements.inputTask.identifier);
        elements.addTaskButton.element = document.getElementById(elements.addTaskButton.identifier);
        elements.taskList.element = document.getElementById(elements.taskList.identifier);
        elements.deleteButtons.element = document.getElementsByClassName(elements.deleteButtons.identifier);

        elements.addTaskButton.element.addEventListener("click", elements.addTaskButton.listener)

        const deleteButtons = elements.deleteButtons.element;
        for (let i = 0; i < deleteButtons.length; i++) {
            let deleteButton = deleteButtons.item(i)
            deleteButton.addEventListener("click", elements.deleteButtons.listener);
        }
    }

    return {
        init: init,
    }
})();

ToDoListApp.init();