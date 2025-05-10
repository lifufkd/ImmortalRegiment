document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submissionForm');
    const backButton = document.querySelector('.back-button');
    const additionalInfoInput = document.getElementById('additional_information');
    const senderNameInput = document.getElementById('sender_name');
    const senderEmailInput = document.getElementById('sender_email');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const cyrillicPattern = /^[А-Яа-я\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 10000);
    }

    // Clear error message on input
    [additionalInfoInput, senderNameInput, senderEmailInput].forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.style.display = 'none';
            input.classList.remove('is-invalid');
        });
    });

    // Validate Cyrillic input in real-time for additional_information
    additionalInfoInput.addEventListener('input', () => {
        additionalInfoInput.value = additionalInfoInput.value.replace(/[^А-Яа-я\s]/g, '');
    });

    // Restore form data from localStorage
    function restoreFormData() {
        additionalInfoInput.value = localStorage.getItem('additional_information') || '';
        senderNameInput.value = localStorage.getItem('sender_name') || '';
        senderEmailInput.value = localStorage.getItem('sender_email') || '';
    }

    // Save form data to localStorage
    function saveFormData() {
        localStorage.setItem('additional_information', additionalInfoInput.value);
        localStorage.setItem('sender_name', senderNameInput.value);
        localStorage.setItem('sender_email', senderEmailInput.value);
    }

    // Restore form data on page load
    restoreFormData();

    // Handle "Назад" button
    if (backButton) {
        backButton.addEventListener('click', () => {
            saveFormData();
            window.location.href = 'form-second.html';
        });
    } else {
        console.error('Back button not found');
    }

    // Convert base64 to Blob
    function base64ToBlob(base64Data, mimeType = 'image/png') {
        const cleanedBase64 = base64Data.replace(/\s/g, '');
        const byteChars = atob(cleanedBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    // Form submission ("Отправить" button)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const additionalInfo = additionalInfoInput.value.trim();
        const senderName = senderNameInput.value.trim();
        const senderEmail = senderEmailInput.value.trim();

        // Validate additional_information
        if (additionalInfo && !cyrillicPattern.test(additionalInfo)) {
            showError('Пожалуйста, используйте только русские буквы в поле "Дополнительная информация".');
            additionalInfoInput.classList.add('is-invalid');
            return;
        }

        // Validate sender_name (if provided)
        if (senderName && !cyrillicPattern.test(senderName)) {
            showError('Пожалуйста, используйте только русские буквы в поле "Имя отправителя".');
            senderNameInput.classList.add('is-invalid');
            return;
        }

        // Validate sender_email (if provided)
        if (senderEmail && !emailPattern.test(senderEmail)) {
            showError('Пожалуйста, введите корректный адрес электронной почты.');
            senderEmailInput.classList.add('is-invalid');
            return;
        }

        // Save form data to localStorage
        saveFormData();

        // Prepare form data for API
        const rawData = {
            name: localStorage.getItem('name'),
            surname: localStorage.getItem('surname'),
            patronymic: localStorage.getItem('patronymic'),
            birth_place: localStorage.getItem('birth_place'),
            birth_date: localStorage.getItem('birth_date'),
            death_date: localStorage.getItem('death_date'),
            war_id: localStorage.getItem('war_id'),
            military_rank_id: localStorage.getItem('military_rank_id') === '0' ? null : localStorage.getItem('military_rank_id'),
            military_specialty: localStorage.getItem('military_specialty'),
            enlistment_date: localStorage.getItem('enlistment_date'),
            discharge_date: localStorage.getItem('discharge_date'),
            additional_information: additionalInfo,
            sender_name: senderName,
            sender_email: senderEmail
        };

        // Filter out empty or null values
        const filteredData = {};
        for (const [key, value] of Object.entries(rawData)) {
            if (value !== null && value !== undefined && value.trim() !== '') {
                filteredData[key] = value;
            }
        }

        const params = new URLSearchParams(filteredData);
        const formDataPhoto = new FormData();
        const rawPhoto = localStorage.getItem('photo');

        if (rawPhoto) {
            const base64Data = rawPhoto.includes(',') ? rawPhoto.split(',')[1] : rawPhoto;
            const blob = base64ToBlob(base64Data, 'image/png');
            const file = new File([blob], 'photo.png', { type: 'image/png' });
            formDataPhoto.append('photo', file);
        }

        try {
            const apiUrl = window.API_BASE_URL || 'http://127.0.0.1:8000'; // Fallback URL
            const response = await axios.post(`${apiUrl}/heroes/`, formDataPhoto, {
                params: params,
                headers: {
                    'Content-Type': rawPhoto ? 'multipart/form-data' : 'application/json'
                }
            });

            if (response.status === 201 || response.status === 200) {
                localStorage.clear();
                const successModal = document.getElementById('successModal');
                successModal.style.display = 'block';
                setTimeout(() => {
                    successModal.style.display = 'none';
                    window.location.href = 'index.html';
                }, 5000);
            }
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            showError('Произошла ошибка при отправке данных. Проверьте консоль для деталей.');
        }
    });
});