document.addEventListener("DOMContentLoaded", function () {
    // Получаем ссылки на основные элементы интерфейса
    const taskContainer = document.querySelector(".tasks");
    const addTaskInput = document.querySelector(".add-task input");
    const addTaskButton = document.querySelector(".add-task span");
    const overlay = document.getElementById("overlay");
    let categoryTitle = document.querySelector(".task-category h2");
    const editCategoryButton = document.querySelector(".task-category-button .edit-btn");
    const confirmCategoryButton = document.querySelector(".task-category-button .confirm-btn");
    const categoryList = document.querySelector(".categories");
    const addCategoryBtn = document.querySelector(".add-category");
    const addTaskBlock = document.querySelector(".task.add-task");

    // Объект для хранения задач по категориям
    const tasksByCategory = {};

    // Функция управления видимостью кнопки изменения
    // названия категории над списком задач
    function toggleAddTaskVisibility() {
        const activeCategory = categoryList.querySelector("li.active");
        if (activeCategory) {
            addTaskBlock.style.display = "flex";
            editCategoryButton.style.display = "inline"; // Показываем кнопку редактирования
        } else {
            addTaskBlock.style.display = "none";
            editCategoryButton.style.display = "none"; // Скрываем кнопку редактирования
        }
    }

     // Функция создания и редактирования задачи
    function createTask(text, categoryName) {
        // Создаем задачу
        const task = document.createElement("div");
        task.classList.add("task");
        task.dataset.category = categoryName; // Связываем задачу с категорией
    
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
    
        // Добавляем задачу в соответствующую категорию
        if (!tasksByCategory[categoryName]) {
            tasksByCategory[categoryName] = [];
        }
        tasksByCategory[categoryName].push(task);

        // Обработчик завершения задачи
        checkbox.addEventListener("change", function () {
            task.classList.toggle("completed", checkbox.checked);
        });

        // Обработчик редактирования задачи
        editButton.addEventListener("click", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = label.textContent;
            input.classList.add("edit-input");
            task.replaceChild(input, label);
            editButton.style.display = "none";
            confirmButton.style.display = "inline";
            overlay.style.display = "block";
            task.style.position = "relative";
            task.style.zIndex = "20";
        });

        // Обработчик подтверждения редактирования
        confirmButton.addEventListener("click", function () {
            const input = task.querySelector(".edit-input");
            label.textContent = input.value;
            task.replaceChild(label, input);
            confirmButton.style.display = "none";
            editButton.style.display = "inline";
            overlay.style.display = "none";
            task.style.position = "static";
            task.style.zIndex = "auto";
        });

        // Обработчик удаления задачи
        deleteButton.addEventListener("click", function () {
            task.remove();
            // Remove from tasksByCategory
            const index = tasksByCategory[categoryName].indexOf(task);
            if (index > -1) {
                tasksByCategory[categoryName].splice(index, 1);
            }
        });

        return task;
    }

     // Функция отображения задач для выбранной категории
    function displayTasksForCategory(categoryName) {
        // Удаляем все существующие задачи, кроме кнопки добавления новой
        const existingTasks = taskContainer.querySelectorAll(".task:not(.add-task)");
        existingTasks.forEach(task => task.remove());
        
        // Если в выбранной категории есть задачи, добавляем их в контейнер
        if (tasksByCategory[categoryName]) {
            tasksByCategory[categoryName].forEach(task => {
                // Вставляем задачи перед последним элементом контейнера (кнопкой добавления)
                taskContainer.insertBefore(task, taskContainer.lastElementChild);
            });
        }
    }

    // Добавление новой задачи
    addTaskButton.addEventListener("click", function () {
        // Получаем текст из поля ввода и активную категорию
        const taskText = addTaskInput.value.trim();
        const activeCategory = categoryList.querySelector("li.active");

        // Проверяем, что поле ввода не пустое и есть активная категория
        if (taskText !== "" && activeCategory) {
            const categoryName = activeCategory.querySelector(".category-text").textContent;
            const task = createTask(taskText, categoryName);

            // Вставляем созданную задачу перед последним элементом в контейнере задач
            taskContainer.insertBefore(task, taskContainer.lastElementChild);
            
            // Очищаем поле ввода после добавления задачи
            addTaskInput.value = "";
        }
    });

    // Добавление задачи по нажатию Enter
    addTaskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTaskButton.click();
        }
    });


    // Функция начала редактирования категории
    function startEditingCategory() {
        const input = document.createElement("input");
        input.type = "text";
        input.value = categoryTitle.textContent;
        input.classList.add("edit-input");
        categoryTitle.replaceWith(input);
        editCategoryButton.style.display = "none";
        confirmCategoryButton.style.display = "inline";
    
        // Меняем категорию как "изменяемую", добавляя класс редакторивания
        const taskCategory = document.querySelector(".task-category");
        taskCategory.style.position = "relative";
        taskCategory.style.zIndex = "100";
        taskCategory.classList.add("edit-category");
    
        // Завершаем редактирование при нажатии Enter
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                confirmEditingCategory(input);
            }
        });
    
        // Завершаем редактирование при потере фокуса
        input.addEventListener("blur", function () {
            confirmEditingCategory(input);
        });
    }

    // Функция подтверждения редактирования категории
    function confirmEditingCategory(input) {
        const newTitle = input.value.trim() || "Без названия";
        const newH2 = document.createElement("h2");
        newH2.textContent = newTitle;
        input.replaceWith(newH2);
        categoryTitle = newH2;
        editCategoryButton.style.display = "inline";
        confirmCategoryButton.style.display = "none";

        // Обновляем название в боковом меню
        updateSidebarCategory(newTitle);
    
        // Убираем класс редактирования
        const taskCategory = document.querySelector(".task-category");
        taskCategory.style.position = "static";
        taskCategory.style.zIndex = "auto";
        taskCategory.classList.remove("edit-category");
    }

    // Назначаем обработчик на кнопку редактирования категории
    editCategoryButton.addEventListener("click", startEditingCategory);

    // Назначаем обработчик на кнопку подтверждения редактирования
    confirmCategoryButton.addEventListener("click", function () {
        const input = document.querySelector(".task-category input");
        if (input) {
            confirmEditingCategory(input);
        }
    });

    // Функция обновления названия категории в боковом списке
    function updateSidebarCategory(newName) {
        const activeCategory = document.querySelector(".categories li.active");

        // Обновляем название
        if (activeCategory) {
            activeCategory.querySelector(".category-text").textContent = newName;
        }
    }

    // Функция установки активной категории
    function setActiveCategory(category) {
        const prevActive = document.querySelector(".categories li.active");

        // Убираем класс активности
        if (prevActive) {
            const text = prevActive.querySelector(".category-text").textContent;
            prevActive.innerHTML = text;
            prevActive.classList.remove("active");
        }

        // Делаем новую категорию активной
        category.classList.add("active");
        const text = category.textContent.trim();

        // Добавляем кнопки редактирования/удаления
        category.innerHTML = `<label class="category-text">${text}</label>
            <div class="category-btns">
                <button class="category-edit-btn"><i class="fas fa-edit"></i></button>
                <button class="category-confirm-btn" style="display: none;"><i class="fas fa-check"></i></button>
                <button class="category-delete-btn"><i class="fas fa-trash"></i></button>
            </div>`;
        
        // Переключаем видимость поля ввода задач
        toggleAddTaskVisibility(); 

        // Отображаем задачи активной категории
        displayTasksForCategory(text);
    }

    // Обработчик кликов по списку категорий
    categoryList.addEventListener("click", (event) => {
        const target = event.target;

        // Установка активной категории при клике
        if (target.tagName === "LI" && !target.classList.contains("add-category")) {
            setActiveCategory(target);
            categoryTitle.textContent = target.querySelector(".category-text").textContent;
        }

        // Удаление категории
        if (target.closest(".category-delete-btn")) {
            const liToDelete = target.closest("li");
            const categoryName = liToDelete.querySelector(".category-text").textContent;
            const isActive = liToDelete.classList.contains("active");

            // Удаляем связанные задачи и элемент списка
            delete tasksByCategory[categoryName];
            liToDelete.remove();

            if (isActive) {

                // Ищем новую активную категорию
                const firstCategory = categoryList.querySelector("li:not(.add-category)");
                if (firstCategory) {
                    setActiveCategory(firstCategory);
                    categoryTitle.textContent = firstCategory.querySelector(".category-text").textContent;
                } else {

                    // Если категорий нет, показываем заглушку
                    categoryTitle.textContent = "Нет категорий";

                    // Скрываем ввод задач
                    toggleAddTaskVisibility();
                }
            }
        }

        // Редактирование категории
        if (target.closest(".category-edit-btn")) {
            const li = target.closest("li");
            const categoryText = li.querySelector(".category-text");
            const editBtn = li.querySelector(".category-edit-btn");
            const confirmBtn = li.querySelector(".category-confirm-btn");

            // Скрываем кнопку редактирования, показываем кнопку подтверждения
            editBtn.style.display = "none";
            confirmBtn.style.display = "inline";

            // Заменяем текст на input
            const input = document.createElement("input");
            input.type = "text";
            input.value = categoryText.textContent;
            input.classList.add("edit-input");
            categoryText.replaceWith(input);

            // Устанавливаем фокус
            input.focus();

            // Обработка подтверждения изменений
            function confirmEdit() {
                const newName = input.value.trim() || "Без названия";
                const newLabel = document.createElement("label");
                newLabel.classList.add("category-text");
                newLabel.textContent = newName;
                input.replaceWith(newLabel);
        
                // Обновляем заголовок, если это активная категория
                if (li.classList.contains("active")) {
                    categoryTitle.textContent = newName;
                }
        
                // Возвращаем кнопки в исходное состояние
                editBtn.style.display = "inline";
                confirmBtn.style.display = "none";
        
                // Удаляем обработчики, чтобы не срабатывали повторно
                confirmBtn.removeEventListener("click", confirmEdit);
                input.removeEventListener("keydown", handleEnterPress);
            }
        
            // Завершаем редактирование при нажатии Enter
            function handleEnterPress(event) {
                if (event.key === "Enter") {
                    confirmEdit();
                }
            }
        
            // Обработчик сработает только один раз, после чего автоматически удалится
            confirmBtn.addEventListener("click", confirmEdit, { once: true });

            // Добавляется обработчик события keydown (нажатие клавиши) для поля ввода input.
            input.addEventListener("keydown", handleEnterPress);
        }
    });

    // Обработчик добавления категории в список
    addCategoryBtn.addEventListener("click", () => {
        if (addCategoryBtn.classList.contains("editing")) {
            const input = document.querySelector(".new-category-input"); // Получаем поле ввода
            if (input.value.trim()) { // Проверяем, введено ли значение
                const newCategory = document.createElement("li"); // Создаём новый элемент списка
                newCategory.textContent = input.value; // Устанавливаем его текст
                categoryList.insertBefore(newCategory, addCategoryBtn); // Добавляем в список перед кнопкой
                setActiveCategory(newCategory); // Делаем его активным
                categoryTitle.textContent = newCategory.textContent; // Обновляем заголовок категории
            }

            // Убираем класс редактирования
            addCategoryBtn.innerHTML = "+";
            addCategoryBtn.classList.remove("editing");
            input.parentElement.remove();
        } else {

            // Создаём новый элемент списка
            const newLi = document.createElement("li");
            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("new-category-input");
            newLi.appendChild(input);
            categoryList.insertBefore(newLi, addCategoryBtn);
            addCategoryBtn.innerHTML = '<i class="fas fa-check"></i>';
            addCategoryBtn.classList.add("editing");

            // Фокусируемся на поле ввода
            input.focus();

            // Завершаем редактирование при нажатии Enter
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    addCategoryBtn.click();
                }
            });
        }
    });

    // Обновляем видимость поля ввода задач
    toggleAddTaskVisibility();
});