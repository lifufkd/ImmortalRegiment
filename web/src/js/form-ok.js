document.getElementById('submissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 15000); // Закрытие через 5 секунд
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
});