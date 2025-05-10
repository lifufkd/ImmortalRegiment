document.addEventListener('DOMContentLoaded', async () => {
    // Configuration
    const HEROES_URL = 'http://127.0.0.1:8000/heroes/';
    const WARS_URL = 'http://127.0.0.1:8000/wars/';
    const PHOTO_BASE_URL = 'http://127.0.0.1:8000/heroes/';

    const paginationSelect = document.getElementById('pagination-select');
    const gallery = document.getElementById('hero-gallery');
    let currentPage = 1;
    let currentSize = parseInt(paginationSelect.value, 10);

    // Fetch data from API
    const fetchData = async (url, params = {}) => {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
            return null;
        }
    };

    // Function to refresh gallery
    async function refreshGallery(page = 1, size = currentSize) {
        gallery.innerHTML = ''; // Clear existing cards
        const heroesData = await fetchData(HEROES_URL, { page, size });
        if (!heroesData || !heroesData.items) {
            console.error('No hero data received');
            return;
        }

        heroesData.items.forEach(hero => {
            const card = document.createElement('div');
            card.className = 'hero-card';
            card.dataset.name = `${hero.surname} ${hero.name} ${hero.patronymic || ''}`.trim();

            // Image
            const imageDiv = document.createElement('div');
            imageDiv.className = 'hero-card__image';
            const img = document.createElement('img');
            const hasPhoto = hero.photo_name && hero.photo_name.trim() !== '';
            img.src = hasPhoto ? `${PHOTO_BASE_URL}${hero.hero_id}/photo` : '../src/assets/photo/soldier.svg';
            img.alt = hasPhoto ? `Photo of ${hero.surname} ${hero.name}` : '';
            imageDiv.appendChild(img);

            // Info
            const infoDiv = document.createElement('div');
            infoDiv.className = 'hero-card__info';
            const name = document.createElement('h2');
            name.className = 'hero-card__name';
            name.textContent = `${hero.surname} ${hero.name} ${hero.patronymic || ''}`.trim();
            const location = document.createElement('p');
            location.className = 'hero-card__location';
            location.textContent = hero.birth_place || '';
            const details = document.createElement('p');
            details.className = 'hero-card__details';
            details.innerHTML = `${getWarTitle(hero.war_id)}, <br>${getYear(hero.birth_date)} - ${getYear(hero.death_date)}`;

            infoDiv.appendChild(name);
            infoDiv.appendChild(location);
            infoDiv.appendChild(details);

            card.appendChild(imageDiv);
            card.appendChild(infoDiv);

            // Make card clickable
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = `gallery-single.html?hero_id=${hero.hero_id}`;
            });

            gallery.appendChild(card);
        });

        // Dispatch event with total count for pagination
        const event = new CustomEvent('cardsLoaded', { detail: { total: heroesData.total } });
        document.dispatchEvent(event);
    }

    // Get year from YYYY-MM-DD
    const getYear = (dateStr) => {
        return dateStr ? dateStr.split('-')[0] : '';
    };

    // Fetch wars data
    const warsData = await fetchData(WARS_URL) || [];

    // Map war_id to title
    const getWarTitle = (warId) => {
        const war = warsData.find(w => w.war_id === warId);
        return war ? war.title : '';
    };

    // Get gallery container
    if (!gallery) {
        console.error('Gallery container (#hero-gallery) not found');
        return;
    }

    // Initial load
    await refreshGallery(currentPage, currentSize);

    // Listen for pageChange event from pagination.js
    document.addEventListener('pageChange', (e) => {
        currentPage = e.detail.page;
        refreshGallery(currentPage, currentSize);
    });

    // Listen for sizeChange event from pagination.js
    document.addEventListener('sizeChange', (e) => {
        currentPage = 1; // Reset to first page
        currentSize = e.detail.size;
        refreshGallery(currentPage, currentSize);
    });

    // Listen for heroAdded event to refresh gallery
    document.addEventListener('heroAdded', () => {
        currentPage = 1; // Reset to first page
        refreshGallery(currentPage, currentSize);
    });
});