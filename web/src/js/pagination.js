document.addEventListener('DOMContentLoaded', () => {
    const paginationSelect = document.getElementById('pagination-select');
    const gallery = document.getElementById('hero-gallery');
    const cards = gallery.querySelectorAll('.hero-card');

    function updatePagination() {
        const limit = parseInt(paginationSelect.value, 10);
        cards.forEach((card, index) => {
            card.style.display = index < limit ? 'flex' : 'none';
        });
    }

    // Инициализация: показываем первые 15 карточек
    updatePagination();

    // Обработчик изменения выбора
    paginationSelect.addEventListener('change', updatePagination);
});