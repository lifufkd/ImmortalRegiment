document.addEventListener('DOMContentLoaded', () => {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(tooltipTriggerEl => {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
            const form = document.getElementById('main-info-form');
            const surnameInput = document.getElementById('surname');
            const nameInput = document.getElementById('name');
            const errorMessage = document.getElementById('error-message');
            const errorText = document.getElementById('error-text');
            const cyrillicPattern = /^[А-Яа-я\s]+$/;

            function showError(message) {
                errorText.textContent = message;
                errorMessage.style.display = 'flex';
                // Скрыть через 5 секунд
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 10000);
            }

            surnameInput.addEventListener('input', () => {
                errorMessage.style.display = 'none';
            });
            nameInput.addEventListener('input', () => {
                errorMessage.style.display = 'none';
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const surnameValue = surnameInput.value.trim();
                const nameValue = nameInput.value.trim();

                if (!surnameValue || !nameValue) {
                    showError('Пожалуйста, заполните поля "Фамилия" и "Имя".');
                } else if (!cyrillicPattern.test(surnameValue) || !cyrillicPattern.test(nameValue)) {
                    showError('Пожалуйста, используйте только русские буквы.');
                } else {
                    window.location.href = 'form-second.html';
                }
            });
        });