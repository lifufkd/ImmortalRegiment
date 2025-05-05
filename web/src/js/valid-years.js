document.addEventListener('DOMContentLoaded', () => {
    const yearsInput = document.querySelector('input[placeholder="Введите годы службы в формате ГГГГ-ГГГГ"]');

    yearsInput.addEventListener('input', (e) => {
        // Удаляем все, кроме цифр и дефиса
        e.target.value = e.target.value.replace(/[^0-9-]/g, '');

        // Форматируем ввод (добавляем дефис после 4 цифр)
        let value = e.target.value.replace(/-/g, ''); // Удаляем существующие дефисы
        if (value.length > 4) {
            e.target.value = value.slice(0, 4) + '-' + value.slice(4, 8);
        }
    });

    // Проверка при отправке формы
    const form = document.getElementById('soldier-history-form');
    form.addEventListener('submit', (e) => {
        const regex = /^(19|20)\d{2}-(19|20)\d{2}$/;
        if (!regex.test(yearsInput.value)) {
            e.preventDefault();
            yearsInput.classList.add('is-invalid');
        } else {
            yearsInput.classList.remove('is-invalid');
        }
    });
});