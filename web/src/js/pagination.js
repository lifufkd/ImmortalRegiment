document.addEventListener('DOMContentLoaded', () => {
    const paginationSelect = document.getElementById('pagination-select');
    const gallery = document.getElementById('hero-gallery');
    const paginationContainer = document.querySelector('.pagination');
    let currentPage = 1;

    // Function to update pagination
    function updatePagination() {
        const limit = parseInt(paginationSelect.value, 10);
        const cards = gallery.querySelectorAll('.hero-card');
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        const totalCards = visibleCards.length;
        const totalPages = Math.ceil(totalCards / limit);

        // Update card visibility
        visibleCards.forEach((card, index) => {
            const start = (currentPage - 1) * limit;
            const end = start + limit;
            card.style.display = (index >= start && index < end) ? 'flex' : 'none';
        });

        // Generate pagination controls
        paginationContainer.innerHTML = '';
        if (totalPages > 1) {
            // Previous arrow
            const prevArrow = document.createElement('span');
            prevArrow.className = 'page-arrow';
            prevArrow.innerHTML = '&larr;';
            prevArrow.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
            paginationContainer.appendChild(prevArrow);

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageNumber = document.createElement('span');
                pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
                pageNumber.textContent = i;
                pageNumber.addEventListener('click', () => {
                    currentPage = i;
                    updatePagination();
                });
                paginationContainer.appendChild(pageNumber);
            }

            // Next arrow
            const nextArrow = document.createElement('span');
            nextArrow.className = 'page-arrow';
            nextArrow.innerHTML = '&rarr;';
            nextArrow.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
            paginationContainer.appendChild(nextArrow);
        }
    }

    // Initialize pagination
    updatePagination();

    // Handle pagination select change
    paginationSelect.addEventListener('change', () => {
        currentPage = 1; // Reset to first page on limit change
        updatePagination();
    });

    // Expose updatePagination for filter.js to call
    window.updateGalleryPagination = updatePagination;
});