document.addEventListener('DOMContentLoaded', async () => {
    // Configuration
    const HEROES_URL = 'http://127.0.0.1:8000/heroes/';
    const WARS_URL = 'http://127.0.0.1:8000/wars/';
    const PHOTO_BASE_URL = 'http://127.0.0.1:8000/heroes/';

    // Fetch data from API
    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
            return null;
        }
    };

    // Get year from YYYY-MM-DD
    const getYear = (dateStr) => {
        return dateStr ? dateStr.split('-')[0] : '';
    };

    // Fetch heroes and wars data
    const heroesData = await fetchData(HEROES_URL);
    const warsData = await fetchData(WARS_URL) || [];

    if (!heroesData || !heroesData.items) {
        console.error('No hero data received');
        return;
    }

    // Map war_id to title
    const getWarTitle = (warId) => {
        const war = warsData.find(w => w.war_id === warId);
        return war ? war.title : '';
    };

    // Get gallery container
    const gallery = document.getElementById('hero-gallery');
    if (!gallery) {
        console.error('Gallery container (#hero-gallery) not found');
        return;
    }

    // Clear existing cards
    gallery.innerHTML = '';

    // Generate hero cards
    heroesData.items.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.dataset.name = `${hero.surname} ${hero.name} ${hero.patronymic || ''}`.trim();

        // Image
        const imageDiv = document.createElement('div');
        imageDiv.className = 'hero-card__image';
        const img = document.createElement('img');
        const hasPhoto = hero.photo_name && hero.photo_name.trim() !== '';
        img.src = hasPhoto ? `${PHOTO_BASE_URL}${hero.hero_id}/photo` : 'assets/photo/unknow-user.svg';
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

    // Trigger pagination update
    if (window.updateGalleryPagination) {
        window.updateGalleryPagination();
    }
});