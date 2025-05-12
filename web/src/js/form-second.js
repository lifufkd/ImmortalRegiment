document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('soldier-history-form');
    const backButton = document.querySelector('.back-button');
    const nextButton = document.querySelector('.next-button');
    const birthPlaceInput = document.getElementById('birth_place');
    const militarySpecialtyInput = document.getElementById('military_specialty');
    const serviceYearsInput = document.getElementById('service_years');
    const birthYearInput = document.getElementById('birth_year');
    const deathYearInput = document.getElementById('death_year');
    const birthDayInput = document.getElementById('birth_day');
    const birthMonthInput = document.getElementById('birth_month');
    const deathDayInput = document.getElementById('death_day');
    const deathMonthInput = document.getElementById('death_month');
    const rankInput = document.getElementById('rank');
    const warInput = document.getElementById('war');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const cyrillicPattern = /^[А-Яа-я\s-.,]+$/;
    const yearPattern = /^(19|20)\d{2}$/;
    const serviceYearsPattern = /^(19|20)\d{2}-(19|20)\d{2}$/;
    let submissionAttempt = 0;

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 10000);
    }

    // Clear error message on input
    [birthPlaceInput, militarySpecialtyInput, serviceYearsInput, birthYearInput, deathYearInput].forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.style.display = 'none';
            input.classList.remove('is-invalid');
        });
    });

    // Clear error message on select change
    [birthDayInput, birthMonthInput, deathDayInput, deathMonthInput, rankInput, warInput].forEach(select => {
        select.addEventListener('change', () => {
            errorMessage.style.display = 'none';
            select.classList.remove('is-invalid');
        });
    });

    // Validate Cyrillic input in real-time for birth_place and military_specialty
    [birthPlaceInput, militarySpecialtyInput].forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^А-Яа-я\s-.,]/g, '');
        });
    });

    // Validate and format service years
    serviceYearsInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9-]/g, '');
        if (value.length > 4 && value.charAt(4) !== '-') {
            value = value.slice(0, 4) + '-' + value.slice(4, 8);
        }
        e.target.value = value.slice(0, 9);
    });

    // Validate birth and death years
    function validateYear(input) {
        let value = input.value.replace(/[^0-9]/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length === 4) {
            const year = parseInt(value, 10);
            if (year < 1900 || year > 2099) {
                value = value.slice(0, -1);
            }
        }
        input.value = value;
    }

    birthYearInput.addEventListener('input', () => validateYear(birthYearInput));
    deathYearInput.addEventListener('input', () => validateYear(deathYearInput));

    // Date formatting function
    function toDateString(year, month, day) {
        if (!year || !month || !day) return '';
        const map = {
            january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
            july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
        };

    const mm = map[month] || '01';
        const dd = day.padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    }

    // Restore form data from localStorage
    function restoreFormData() {
        birthPlaceInput.value = localStorage.getItem('birth_place') || '';
        militarySpecialtyInput.value = localStorage.getItem('military_specialty') || '';
        serviceYearsInput.value = localStorage.getItem('service_years') || '';
        birthYearInput.value = localStorage.getItem('birth_year') || '';
        deathYearInput.value = localStorage.getItem('death_year') || '';
        birthDayInput.value = localStorage.getItem('birth_day') || '1';
        birthMonthInput.value = localStorage.getItem('birth_month') || 'january';
        deathDayInput.value = localStorage.getItem('death_day') || '1';
        deathMonthInput.value = localStorage.getItem('death_month') || 'january';
        rankInput.value = localStorage.getItem('military_rank_id') || '';
        warInput.value = localStorage.getItem('war_id') || '1';
    }

    // Save form data to localStorage
    function saveFormData() {
        localStorage.setItem('birth_place', birthPlaceInput.value);
        localStorage.setItem('birth_year', birthYearInput.value);
        localStorage.setItem('birth_month', birthMonthInput.value);
        localStorage.setItem('birth_day', birthDayInput.value);
        localStorage.setItem('death_year', deathYearInput.value);
        localStorage.setItem('death_month', deathMonthInput.value);
        localStorage.setItem('death_day', deathDayInput.value);
        localStorage.setItem('military_rank_id', rankInput.value);
        localStorage.setItem('military_specialty', militarySpecialtyInput.value);
        localStorage.setItem('service_years', serviceYearsInput.value);
        localStorage.setItem('war_id', warInput.value);

        const years = serviceYearsInput.value.split('-');
        localStorage.setItem('enlistment_date', years[0] ? `${years[0]}-01-01` : '');
        localStorage.setItem('discharge_date', years[1] ? `${years[1]}-01-01` : '');
        localStorage.setItem('birth_date', toDateString(
            birthYearInput.value,
            birthMonthInput.value,
            birthDayInput.value
        ));
        localStorage.setItem('death_date', toDateString(
            deathYearInput.value,
            deathMonthInput.value,
            deathDayInput.value
        ));
    }

    // Restore form data on page load
    restoreFormData();

    // Handle "Назад" button
    if (backButton) {
        backButton.addEventListener('click', () => {
            saveFormData();
            window.location.href = 'form-main.html';
        });
    } else {
        console.error('Back button not found');
    }

    // Form submission ("Далее" button)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const birthPlace = birthPlaceInput.value.trim();
        const militarySpecialty = militarySpecialtyInput.value.trim();
        const serviceYears = serviceYearsInput.value.trim();
        const birthYear = birthYearInput.value.trim();
        const deathYear = deathYearInput.value.trim();
        const war = warInput.value;
        let errors = [];

        // Increment submission attempt
        submissionAttempt++;

        // Validate war (required)
        if (!war) {
            errors.push('Пожалуйста, выберите войну.');
            warInput.classList.add('is-invalid');
        }

        // Validate birth place (optional, Cyrillic and punctuation only)
        if (birthPlace && !cyrillicPattern.test(birthPlace)) {
            errors.push('Пожалуйста, используйте только русские буквы и символы (-.,) в поле "Место рождения".');
            birthPlaceInput.classList.add('is-invalid');
        }

        // Validate military specialty (optional, Cyrillic and punctuation only)
        if (militarySpecialty && !cyrillicPattern.test(militarySpecialty)) {
            errors.push('Пожалуйста, используйте только русские буквы и символы (-.,) в поле "Воинская специальность".');
            militarySpecialtyInput.classList.add('is-invalid');
        }

        // Validate service years (optional)
        if (serviceYears && !serviceYearsPattern.test(serviceYears)) {
            errors.push('Пожалуйста, введите годы службы в формате ГГГГ-ГГГГ (например, 1943-2000).');
            serviceYearsInput.classList.add('is-invalid');
        }

        // Validate birth year (optional)
        if (birthYear && !yearPattern.test(birthYear)) {
            errors.push('Пожалуйста, введите корректный год рождения (1900-2099).');
            birthYearInput.classList.add('is-invalid');
        }

        // Validate death year (optional)
        if (deathYear && !yearPattern.test(deathYear)) {
            errors.push('Пожалуйста, введите корректный год смерти (1900-2099).');
            deathYearInput.classList.add('is-invalid');
        }

        // Validate date consistency (if both years provided)
        if (birthYear && deathYear && parseInt(birthYear) > parseInt(deathYear)) {
            errors.push('Год рождения не может быть позже года смерти.');
            birthYearInput.classList.add('is-invalid');
            deathYearInput.classList.add('is-invalid');
        }

        // Validate death date consistency (if death_year provided)
        if (deathYear && (!deathDayInput.value || !deathMonthInput.value)) {
            errors.push('Пожалуйста, заполните все поля даты смерти (день, месяц, год).');
            deathYearInput.classList.add('is-invalid');
            deathDayInput.classList.add('is-invalid');
            deathMonthInput.classList.add('is-invalid');
        }

        // Display errors based on submission attempt
        if (errors.length > 0) {
            let errorMessageText;
            if (submissionAttempt === 1 && (errors.some(e => e.includes('русские буквы')))) {
                errorMessageText = 'Пожалуйста, используйте только русские буквы и символы (-.,) в полях текста.';
            } else {
                errorMessageText = 'Проверьте корректность дат рождения и смерти, а также удостоверьтесь в вводе ТОЛЬКО русских символов и знаков (-.,).';
            }
            showError(errorMessageText);
            return;
        }

        // Save data to localStorage
        saveFormData();

        // Redirect to next page
        window.location.href = 'form-third.html';
    });
});