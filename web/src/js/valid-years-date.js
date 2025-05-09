document.addEventListener('DOMContentLoaded', function () {
    const birthYearInput = document.getElementById('birth_year');
    const deathYearInput = document.getElementById('death_year');

    function validateYear(input) {
        let value = input.value.replace(/[^0-9]/g, ''); // Удаляем все нечисловые символы
        if (value.length > 4) value = value.slice(0, 4); // Ограничиваем до 4 символов
        if (value.length === 4) {
            const year = parseInt(value, 10);
            if (year < 1900 || year > 2099) {
                value = value.slice(0, -1); // Удаляем последний символ, если год вне диапазона
            }
        }
        input.value = value;
    }

    birthYearInput.addEventListener('input', function () {
        validateYear(this);
    });

    deathYearInput.addEventListener('input', function () {
        validateYear(this);
    });
});