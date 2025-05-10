document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
  });

  const form = document.getElementById('main-info-form');
  const surnameInput = document.getElementById('surname');
  const nameInput = document.getElementById('name');
  const patronymicInput = document.getElementById('patronymic');
  const photoInput = document.getElementById('photo-input');
  const photoPlaceholder = document.querySelector('.photo-placeholder');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const cyrillicPattern = /^[А-Яа-я\s]+$/;

  function showError(message) {
      errorText.textContent = message;
      errorMessage.style.display = 'flex';
      setTimeout(() => {
          errorMessage.style.display = 'none';
      }, 10000);
  }

  // Clear error message on input
  surnameInput.addEventListener('input', () => {
      errorMessage.style.display = 'none';
  });
  nameInput.addEventListener('input', () => {
      errorMessage.style.display = 'none';
  });
  patronymicInput.addEventListener('input', () => {
      errorMessage.style.display = 'none';
  });

  // Restore form data from localStorage
  function restoreFormData() {
      surnameInput.value = localStorage.getItem('surname') || '';
      nameInput.value = localStorage.getItem('name') || '';
      patronymicInput.value = localStorage.getItem('patronymic') || '';
      const photoData = localStorage.getItem('photo');
      if (photoData && photoPlaceholder) {
          const img = document.createElement('img');
          img.src = photoData;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          photoPlaceholder.innerHTML = '';
          photoPlaceholder.appendChild(img);
      }
  }

  // Restore form data on page load
  restoreFormData();

  form.addEventListener('submit', (event) => {
      event.preventDefault();
      const surnameValue = surnameInput.value.trim();
      const nameValue = nameInput.value.trim();
      const patronymicValue = patronymicInput.value.trim();
      const photoFile = photoInput.files[0];

      // Validate required fields
      if (!surnameValue || !nameValue) {
          showError('Пожалуйста, заполните поля "Фамилия" и "Имя".');
          return;
      }

      // Validate Cyrillic characters for surname and name
      if (!cyrillicPattern.test(surnameValue) || !cyrillicPattern.test(nameValue)) {
          showError('Пожалуйста, используйте только русские буквы в полях "Фамилия" и "Имя".');
          return;
      }

      // Validate patronymic if provided
      if (patronymicValue && !cyrillicPattern.test(patronymicValue)) {
          showError('Пожалуйста, используйте только русские буквы в поле "Отчество".');
          return;
      }

      // Handle photo upload
      if (photoFile) {
          const reader = new FileReader();
          reader.onload = function () {
              const dataUrl = reader.result;
              localStorage.setItem('photo', dataUrl);
              // Save form data to localStorage
              localStorage.setItem('surname', surnameValue);
              localStorage.setItem('name', nameValue);
              localStorage.setItem('patronymic', patronymicValue);
              // Redirect to next page
              window.location.href = 'form-second.html';
          };
          reader.readAsDataURL(photoFile);
      } else {
          // Save form data to localStorage even if no photo
          localStorage.setItem('surname', surnameValue);
          localStorage.setItem('name', nameValue);
          localStorage.setItem('patronymic', patronymicValue);
          window.location.href = 'form-second.html';
      }
  });
});