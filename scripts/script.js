document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.querySelector(".tasks");
    const addTaskInput = document.querySelector(".add-task input");
    const addTaskButton = document.querySelector(".add-task span");

    function createTask(text) {
        const task = document.createElement("div");
        task.classList.add("task");
    
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
    
        const label = document.createElement("label");
        label.textContent = text;
        label.classList.add("task-text");
    
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // ✏️
        editButton.classList.add("edit-btn");
    
        const confirmButton = document.createElement("button");
        confirmButton.innerHTML = '<i class="fas fa-check"></i>'; // ✅
        confirmButton.classList.add("confirm-btn");
        confirmButton.style.display = "none";
    
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // 🗑️
        deleteButton.classList.add("delete-btn");
    
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(deleteButton);
    
        task.appendChild(checkbox);
        task.appendChild(label);
        task.appendChild(buttonContainer);
        taskContainer.insertBefore(task, taskContainer.lastElementChild);
    

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                task.classList.add("completed");
            } else {
                task.classList.remove("completed");
            }
        });

        editButton.addEventListener("click", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = label.textContent;
            input.classList.add("edit-input");

            task.replaceChild(input, label);
            editButton.style.display = "none";
            confirmButton.style.display = "inline";
        });

        confirmButton.addEventListener("click", function () {
            const input = task.querySelector(".edit-input");
            label.textContent = input.value;
            task.replaceChild(label, input);
            confirmButton.style.display = "none";
            editButton.style.display = "inline";
        });

        deleteButton.addEventListener("click", function () {
            task.remove();
        });
    }

    addTaskButton.addEventListener("click", function () {
        const taskText = addTaskInput.value.trim();
        if (taskText !== "") {
            createTask(taskText);
            addTaskInput.value = "";
        }
    });

    addTaskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTaskButton.click();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const categoryContainer = document.querySelector(".categories");
    const addCategoryBtn = document.querySelector(".add-category");

    addCategoryBtn.addEventListener("click", function () {
        createCategory("Новая категория");
    });

    function createCategory(name) {
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("category-item");

        const categoryName = document.createElement("span");
        categoryName.textContent = name;
        categoryName.classList.add("category-name");

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // ✏️
        editButton.classList.add("edit-category-btn");

        const confirmButton = document.createElement("button");
        confirmButton.innerHTML = '<i class="fas fa-check"></i>'; // ✅
        confirmButton.classList.add("confirm-category-btn");
        confirmButton.style.display = "none";

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // 🗑️
        deleteButton.classList.add("delete-category-btn");

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("category-buttons");
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(deleteButton);

        categoryItem.appendChild(categoryName);
        categoryItem.appendChild(buttonContainer);
        categoryContainer.insertBefore(categoryItem, addCategoryBtn);

        // Обработчик удаления
        deleteButton.addEventListener("click", function () {
            categoryItem.remove();
        });

        // Обработчик редактирования
        editButton.addEventListener("click", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = categoryName.textContent;
            input.classList.add("edit-category-input");

            categoryItem.insertBefore(input, categoryName);
            categoryName.style.display = "none";
            input.focus();

            editButton.style.display = "none";
            confirmButton.style.display = "inline";

            confirmButton.addEventListener("click", function () {
                if (input.value.trim() !== "") {
                    categoryName.textContent = input.value.trim();
                }
                categoryItem.removeChild(input);
                categoryName.style.display = "inline";
                editButton.style.display = "inline";
                confirmButton.style.display = "none";
            });

            // Подтверждение при нажатии Enter
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    confirmButton.click();
                }
            });
        });
    }
});
