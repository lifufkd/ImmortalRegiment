document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('alphabet-filter');
    const gallery = document.getElementById('hero-gallery');
    const cards = gallery.querySelectorAll('.hero-card');

    // Разбиваем строку фильтра на отдельные буквы и добавляем обработчики
    const letters = filterContainer.textContent.trim().split(/\s+/);
    filterContainer.innerHTML = letters.map(letter => `<span>${letter}</span>`).join(' ');

    const filterSpans = filterContainer.querySelectorAll('span');
    filterSpans.forEach(span => {
        span.addEventListener('click', () => {
            // Удаляем активный класс у всех букв
            filterSpans.forEach(s => s.classList.remove('active'));
            // Добавляем активный класс к выбранной букве
            span.classList.add('active');

            const selectedLetter = span.textContent.toLowerCase();
            cards.forEach(card => {
                const name = card.dataset.name.toLowerCase();
                // Проверяем, начинается ли имя, фамилия или отчество с выбранной буквы
                const matches = name.split(' ').some(part => part.startsWith(selectedLetter));
                card.style.display = matches ? 'flex' : 'none';
            });
        });
    });
});