document.addEventListener('DOMContentLoaded', () => {
    // Helper function to map month names to numbers
    const monthMap = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
    };

    // Function to save form data to localStorage
    function saveFormData(formId, data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('heroFormData')) || {};
            const updatedData = { ...existingData, ...data };
            localStorage.setItem('heroFormData', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Ошибка при сохранении данных. Проверьте настройки браузера.');
        }
    }

    // Form-main.html: Collect surname, name, patronymic, photo
    if (document.querySelector('.main-info-form-main')) {
        const form = document.querySelector('.main-info-form-main');
        const nextButton = form.querySelector('.custom-button--dark-text');
        const nextLink = form.querySelector('a[href="form-second.html"]');

        // Add hidden file input for photo upload
        const addPhotoButton = form.querySelector('.add-photo-button');
        const photoInput = document.getElementById("photo-data");

        // Prevent default navigation and save data first
        nextButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate navigation
            const surnameInput = form.querySelector('.input-group-main input[required]');
            const nameInput = form.querySelector('.input-group-main:nth-child(2) input');
            const patronymicInput = form.querySelector('.input-group-main:nth-child(3) input');

            // Validate required surname
            if (!surnameInput.value) {
                alert('Пожалуйста, заполните обязательное поле: Фамилия ветерана.');
                return;
            }

            const formData = {
                surname: surnameInput.value || null,
                name: nameInput.value || null,
                patronymic: patronymicInput.value || null,
                photo: photoInput.files[0] || null
            };
            

            saveFormData('main', formData);
            window.location.href = nextLink.href; // Navigate after saving
        });
    }

    // Form-second.html: Collect birth_date, death_date, birth_place, war_id, military_rank_id, military_specialty
    if (document.querySelector('.main-info-form-second')) {
        const form = document.querySelector('.main-info-form-second');
        const nextButton = form.querySelector('.custom-button--dark-text:last-child');
        const nextLink = form.querySelector('a[href="form-third.html"]');

        nextButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate navigation
            const birthPlaceInput = form.querySelector('input[placeholder="Введите место рождения"]');
            const birthDaySelect = form.querySelector('select[name="birth-day"]');
            const birthMonthSelect = form.querySelector('select[name="birth-month"]');
            const birthYearInput = form.querySelector('input[name="birth-year"]');
            const deathDaySelect = form.querySelector('select[name="death-day"]');
            const deathMonthSelect = form.querySelector('select[name="death-month"]');
            const deathYearInput = form.querySelector('input[name="death-year"]');
            const warSelect = form.querySelector('select[name="war"]');
            const militaryRankInput = form.querySelector('input[placeholder="Введите воинское звание"]');
            const militarySpecialtyInput = form.querySelector('input[placeholder="Введите воинскую специальность"]');

            // Validate required war_id
            if (!warSelect.value) {
                alert('Пожалуйста, выберите войну.');
                return;
            }

            // Format birth_date as YYYY-MM-DD
            let birthDate = null;
            if (birthYearInput.value && birthMonthSelect.value && birthDaySelect.value) {
                const month = monthMap[birthMonthSelect.value.toLowerCase()];
                birthDate = `${birthYearInput.value}-${month}-${birthDaySelect.value.padStart(2, '0')}`;
            }

            // Format death_date as YYYY-MM-DD
            let deathDate = null;
            if (deathYearInput.value && deathMonthSelect.value && deathDaySelect.value) {
                const month = monthMap[deathMonthSelect.value.toLowerCase()];
                deathDate = `${deathYearInput.value}-${month}-${deathDaySelect.value.padStart(2, '0')}`;
            }

            const formData = {
                birth_place: birthPlaceInput.value || null,
                birth_date: birthDate,
                death_date: deathDate,
                war_id: warSelect.value || null,
                military_rank_id: militaryRankInput.value || null,
                military_specialty: militarySpecialtyInput.value || null
            };
            console.log(formData)

            saveFormData('second', formData);
            window.location.href = nextLink.href; // Navigate after saving
        });
    }

    // Form-third.html: Collect additional_information, sender_name, sender_email, and send data
    if (document.querySelector('.main-info-form-third')) {
        const form = document.querySelector('.main-info-form-third');
        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const additionalInfoTextarea = form.querySelector('.large-textarea');
            const senderNameInput = form.querySelector('input[placeholder="Введите имя"]');
            const senderEmailInput = form.querySelector('input[placeholder="Введите e-mail"]');

            // Retrieve all form data from localStorage
            let formData;
            try {
                formData = JSON.parse(localStorage.getItem('heroFormData')) || {};
            } catch (error) {
                console.error('Error retrieving from localStorage:', error);
                alert('Ошибка при загрузке данных. Попробуйте начать заново.');
                return;
            }
            console.log(formData.photo);
            // Prepare data for API
            const payload = {
                hero_id: Date.now().toString(),
                surname: formData.surname || null,
                name: formData.name || null,
                patronymic: formData.patronymic || null,
                birth_date: formData.birth_date || null,
                death_date: formData.death_date || null,
                birth_place: formData.birth_place || null,
                photo_name: formData.photo_name || null,
                photo_type: formData.photo_type || null,
                war_id: formData.war_id || null,
                military_rank_id: formData.military_rank_id || null,
                military_specialty: formData.military_specialty || null,
                additional_information: additionalInfoTextarea.value || null,
                created_at: new Date().toISOString(),
                sender_name: senderNameInput.value || null,
                sender_email: senderEmailInput.value || null
            };
            const formDataPhoto = new FormData();
            formDataPhoto.append('photo', formData.photo);
            console.log(formDataPhoto)

            // Log payload for debugging
            console.log('Payload to send:', payload);

            // Validate required fields
            if (!payload.surname || !payload.name || !payload.war_id) {
                alert('Пожалуйста, заполните обязательные поля: Фамилия, Имя и Война. Возможно, данные не были сохранены на предыдущих страницах.');
                console.warn('Missing required fields:', {
                    surname: payload.surname,
                    name: payload.name,
                    war_id: payload.war_id
                });
                return;
            }

            try {
                console.log(formDataPhoto)
                if (formDataPhoto) {
                    const response = await axios.post('http://127.0.0.1:8000/heroes/', formDataPhoto, {
                        params: payload, // query-параметры
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      }
                      
                }
                else {
                    const response = await axios.post('http://127.0.0.1:8000/heroes/', 
                        {},
                        {
                          params: payload
                        }
                      );
                }

                alert('Данные успешно отправлены!');
                localStorage.removeItem('heroFormData');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Ошибка при отправке данных:', error);
                alert('Произошла ошибка при отправке данных. Проверьте консоль для деталей.');
            }
        });
    }
});