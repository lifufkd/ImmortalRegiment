document.addEventListener('DOMContentLoaded', () => {
    const addPhotoButton = document.querySelector('.add-photo-button');
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    let fileInput = document.getElementById('photo-input'); // Создаем скрытый input для выбора файла

    // // Настраиваем input
    // fileInput.type = 'file';
    // fileInput.id = 'photo-data';
    // fileInput.accept = 'image/jpeg,image/png'; // Ограничиваем типы файлов
    // fileInput.style.display = 'none'; // Скрываем input
    // document.body.appendChild(fileInput); // Добавляем input в DOM

    // Обработчик клика по кнопке "Добавить фото"
    addPhotoButton.addEventListener('click', () => {
        fileInput.click(); // Инициируем выбор файла
    });

    // Обработчик выбора файла
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            // Проверяем тип файла
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Пожалуйста, выберите файл формата JPG или PNG.');
                fileInput.value = ''; // Очищаем input
                return;
            }

            // Создаем URL для предварительного просмотра
            const reader = new FileReader();
            reader.onload = (e) => {
                // Очищаем placeholder и добавляем изображение
                photoPlaceholder.innerHTML = ''; // Удаляем содержимое placeholder
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100%'; // Растягиваем по ширине
                img.style.height = '100%'; // Растягиваем по высоте
                img.style.objectFit = 'cover'; // Обеспечиваем заполнение контейнера
                img.alt = 'Загруженное фото';
                photoPlaceholder.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Инициализация tooltip (оставляем ваш существующий код)
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});