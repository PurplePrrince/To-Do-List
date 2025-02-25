document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.querySelector(".tasks");
    const addTaskInput = document.querySelector(".add-task input");
    const addTaskButton = document.querySelector(".add-task span");
    const overlay = document.getElementById("overlay");
    let categoryTitle = document.querySelector(".task-category h2");
    const editCategoryButton = document.querySelector(".task-category-button .edit-btn");
    const confirmCategoryButton = document.querySelector(".task-category-button .confirm-btn");
    const categories = document.querySelectorAll(".categories li:not(.add-category)");
    const categoryList = document.querySelector(".categories");
    const addCategoryBtn = document.querySelector(".add-category");

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
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add("edit-btn");
    
        const confirmButton = document.createElement("button");
        confirmButton.innerHTML = '<i class="fas fa-check"></i>';
        confirmButton.classList.add("confirm-btn");
        confirmButton.style.display = "none";
    
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
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
            task.classList.toggle("completed", checkbox.checked);
        });

        editButton.addEventListener("click", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = label.textContent;
            input.classList.add("edit-input");
            task.replaceChild(input, label);
            editButton.style.display = "none";
            confirmButton.style.display = "inline";

            // Показываем оверлей
            overlay.style.display = "block";
            task.style.position = "relative"; // Чтобы задача была поверх оверлея
            task.style.zIndex = "20"; // Задача должна быть выше оверлея
        });

        confirmButton.addEventListener("click", function () {
            const input = task.querySelector(".edit-input");
            label.textContent = input.value;
            task.replaceChild(label, input);
            confirmButton.style.display = "none";
            editButton.style.display = "inline";

            overlay.style.display = "none";
            task.style.position = "static"; // Возвращаем позицию по умолчанию
            task.style.zIndex = "auto"; // Возвращаем z-index по умолчанию
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

    function startEditingCategory() {
        const input = document.createElement("input");
        input.type = "text";
        input.value = categoryTitle.textContent;
        input.classList.add("edit-input");
        categoryTitle.replaceWith(input);
        editCategoryButton.style.display = "none";
        confirmCategoryButton.style.display = "inline";
    
        // Показываем оверлей
        overlay.style.display = "block";
    
        // Поднять task-category выше оверлея
        const taskCategory = document.querySelector(".task-category");
        taskCategory.style.position = "relative";
        taskCategory.style.zIndex = "100";
        taskCategory.classList.add("edit-category");
    
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                confirmEditingCategory(input);
            }
        });
    
        input.addEventListener("blur", function () {
            confirmEditingCategory(input);
        });
    }

    function confirmEditingCategory(input) {
        const newTitle = input.value.trim() || "Без названия";
        const newH2 = document.createElement("h2");
        newH2.textContent = newTitle;
        input.replaceWith(newH2);
        categoryTitle = newH2;
        editCategoryButton.style.display = "inline";
        confirmCategoryButton.style.display = "none";

        // Обновляем название активной категории в списке
        updateSidebarCategory(newTitle);
    
        // Скрываем оверлей
        overlay.style.display = "none";
    
        // Возвращаем .task-category в нормальное состояние
        const taskCategory = document.querySelector(".task-category");
        taskCategory.style.position = "static";
        taskCategory.style.zIndex = "auto";
        taskCategory.classList.remove("edit-category");
    }
    
    editCategoryButton.addEventListener("click", startEditingCategory);
    confirmCategoryButton.addEventListener("click", function () {
        const input = document.querySelector(".task-category input");
        if (input) {
            confirmEditingCategory(input);
        }
    });

    function updateSidebarCategory(newName) {
        const activeCategory = document.querySelector(".categories li.active");
        if (activeCategory) {
            activeCategory.textContent = newName;
        }
    }

    categoryList.addEventListener("click", (event) => {
        if (event.target.tagName === "LI" && !event.target.classList.contains("add-category")) {
            document.querySelector(".categories li.active")?.classList.remove("active"); 
            event.target.classList.add("active");
            categoryTitle.textContent = event.target.textContent;
        }
    });
    

    addCategoryBtn.addEventListener("click", () => {
        if (addCategoryBtn.classList.contains("editing")) {
            const input = document.querySelector(".new-category-input");
            if (input.value.trim()) {
                const newCategory = document.createElement("li");
                newCategory.textContent = input.value;
                categoryList.insertBefore(newCategory, addCategoryBtn);
            }
            addCategoryBtn.innerHTML = "+";
            addCategoryBtn.classList.remove("editing");
            input.parentElement.remove();
        } else {
            const newLi = document.createElement("li");
            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("new-category-input");
            newLi.appendChild(input);
            categoryList.insertBefore(newLi, addCategoryBtn);
            addCategoryBtn.innerHTML = '<i class="fas fa-check"></i>';
            addCategoryBtn.classList.add("editing");
            input.focus();
        }
    });
});
