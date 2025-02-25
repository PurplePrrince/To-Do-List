const icon = document.querySelector('.burger-menu');
const list = document.querySelector('.categories');
const sidebar = document.querySelector('.sidebar');

icon.addEventListener('click', (event) => {
    icon.classList.toggle('open');

    if (list.classList.contains('open')) {
        // Если класс open есть, запускаем анимацию исчезновения
        list.style.animation = 'slideUp 0.3s ease-out forwards';

        // Удаляем класс open после завершения анимации
        list.addEventListener('animationend', () => {
            list.classList.remove('open');
            list.style.animation = ''; // Сбрасываем анимацию
        }, { once: true });

        sidebar.addEventListener('animationend', () => {
            sidebar.classList.remove('open');
            sidebar.style.animation = ''; // Сбрасываем анимацию
        }, { once: true });
    } else {
        // Если класса open нет, добавляем его
        list.classList.add('open');
    }
});