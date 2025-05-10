document.addEventListener('DOMContentLoaded', async () => {
    // Configuration
    const HEROES_URL = `${window.API_BASE_URL}/heroes/`;
    const WARS_URL = `${window.API_BASE_URL}/wars/`;
    const PHOTO_BASE_URL = `${window.API_BASE_URL}/heroes/`;

    const paginationSelect = document.getElementById('pagination-select');
    const gallery = document.getElementById('hero-gallery');
    const alphabetFilter = document.getElementById('alphabet-filter');
    let currentPage = 1;
    let currentSize = parseInt(paginationSelect.value, 10);
    let activeFilter = null; // Track the active filter letter
    let activeLetterSpan = null; // Track the active letter span for styling

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
        const params = { page, size };
        if (activeFilter) {
            params.surname_first_letter = activeFilter;
        }
        const heroesData = await fetchData(HEROES_URL, params);
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
            img.src = hasPhoto ? `${PHOTO_BASE_URL}${hero.hero_id}/photo` : 'assets/photo/soldier.svg';
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
            location.textContent = hero.birth_place && hero.birth_place.trim() !== '' ? hero.birth_place : 'Место рождения: Не указано';
            const details = document.createElement('p');
            details.className = 'hero-card__details';
            const birthYear = getYear(hero.birth_date);
            const deathYear = getYear(hero.death_date);
            const lifeYears = birthYear || deathYear ? `Годы жизни: ${birthYear || '?'} - ${deathYear || '?'}` : 'Годы жизни: Не указано';
            details.innerHTML = `${getWarTitle(hero.war_id)}, <br>${lifeYears}`;

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

    // Dynamically create individual letter elements
    const alphabet = 'А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Э Ю Я'.split(' ');
    alphabetFilter.innerHTML = ''; // Clear existing content
    alphabet.forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.className = 'filter-letter';
        alphabetFilter.appendChild(span);
    });

    // Add click event for alphabet filter
    alphabetFilter.addEventListener('click', (e) => {
        const letterSpan = e.target.closest('.filter-letter');
        if (letterSpan) {
            const letter = letterSpan.textContent.trim();
            if (activeFilter === letter) {
                activeFilter = null; // Toggle off
                activeLetterSpan.classList.remove('active'); // Remove active class
                activeLetterSpan = null;
            } else {
                if (activeLetterSpan) {
                    activeLetterSpan.classList.remove('active'); // Remove active from previous letter
                }
                activeFilter = letter; // Toggle on
                activeLetterSpan = letterSpan;
                activeLetterSpan.classList.add('active'); // Add active class
                currentPage = 1; // Reset to first page on new filter
            }
            refreshGallery(currentPage, currentSize);
        }
    });

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