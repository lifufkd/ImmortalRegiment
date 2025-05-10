document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('alphabet-filter');
    const gallery = document.getElementById('hero-gallery');
    let activeLetter = null;

    // Split filter string into letters and create clickable spans
    const letters = filterContainer.textContent.trim().split(/\s+/);
    filterContainer.innerHTML = letters.map(letter => `<span>${letter}</span>`).join(' ');

    const filterSpans = filterContainer.querySelectorAll('span');
    filterSpans.forEach(span => {
        span.addEventListener('click', () => {
            const selectedLetter = span.textContent.toLowerCase();

            // Check if clicking the same letter again
            if (activeLetter === selectedLetter) {
                // Clear filter: show all cards
                const cards = gallery.querySelectorAll('.hero-card');
                cards.forEach(card => {
                    card.style.display = 'flex';
                });
                // Remove active class from all spans
                filterSpans.forEach(s => s.classList.remove('active'));
                activeLetter = null;
            } else {
                // Apply filter for selected letter
                filterSpans.forEach(s => s.classList.remove('active'));
                span.classList.add('active');

                const cards = gallery.querySelectorAll('.hero-card');
                cards.forEach(card => {
                    const name = card.dataset.name.toLowerCase();
                    const matches = name.split(' ').some(part => part.startsWith(selectedLetter));
                    card.style.display = matches ? 'flex' : 'none';
                });

                activeLetter = selectedLetter;
            }

            // Update pagination (reset to page 1)
            if (window.updateGalleryPagination) {
                window.updateGalleryPagination();
            }
        });
    });
});