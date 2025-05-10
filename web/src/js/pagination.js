document.addEventListener('DOMContentLoaded', () => {
    const paginationSelect = document.getElementById('pagination-select');
    const gallery = document.getElementById('hero-gallery');
    const paginationContainer = document.querySelector('.pagination');
    let currentPage = 1;
    let totalHeroes = 0;

    // Function to update pagination controls
    function updatePagination() {
        if (!gallery) {
            console.error('Gallery container (#hero-gallery) not found');
            return;
        }

        const limit = parseInt(paginationSelect.value, 10);
        const totalPages = Math.ceil(totalHeroes / limit);


        // Ensure currentPage is valid
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
            document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: currentPage } }));
        } else if (currentPage < 1) {
            currentPage = 1;
        }

        // Generate pagination controls
        paginationContainer.innerHTML = '';
        if (totalPages > 1) {
            // Previous arrow
            const prevArrow = document.createElement('span');
            prevArrow.className = `page-arrow ${currentPage === 1 ? 'disabled' : ''}`;
            prevArrow.innerHTML = '←';
            prevArrow.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: currentPage } }));
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
                    document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: currentPage } }));
                    updatePagination();
                });
                paginationContainer.appendChild(pageNumber);
            }

            // Next arrow
            const nextArrow = document.createElement('span');
            nextArrow.className = `page-arrow ${currentPage === totalPages ? 'disabled' : ''}`;
            nextArrow.innerHTML = '→';
            nextArrow.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: currentPage } }));
                    updatePagination();
                }
            });
            paginationContainer.appendChild(nextArrow);
        }
    }

    // Listen for cardsLoaded event from gallery-data.js
    document.addEventListener('cardsLoaded', (e) => {
        totalHeroes = e.detail.total || 0;
        updatePagination();
    });

    // Handle pagination select change
    paginationSelect.addEventListener('change', () => {
        const newSize = parseInt(paginationSelect.value, 10);
        currentPage = 1; // Reset to first page
        document.dispatchEvent(new CustomEvent('sizeChange', { detail: { size: newSize } }));
        updatePagination();
    });

    // Expose updatePagination for filter.js
    window.updateGalleryPagination = () => {
        currentPage = 1; // Reset to first page on filter change
        document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: currentPage } }));
        updatePagination();
    };
});