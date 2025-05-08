document.getElementById('main-info-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const photoInput = document.getElementById('photo-input');
    const photoFile = photoInput.files[0];
    const reader = new FileReader();
      reader.onload = function () {
        const dataUrl = reader.result; // This is a base64-encoded data URL
        localStorage.setItem('photo', dataUrl);
      };

      if (photoFile) {
        reader.readAsDataURL(photoFile); // Converts to base64
      }

    localStorage.setItem('surname', document.getElementById('surname').value);
    localStorage.setItem('name', document.getElementById('name').value);
    localStorage.setItem('patronymic', document.getElementById('patronymic').value);
    window.location.href = 'form-second.html';
});
