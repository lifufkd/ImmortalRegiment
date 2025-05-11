document.addEventListener('DOMContentLoaded', async () => {
    // Configuration
    const HERO_BASE_URL = `${window.API_BASE_URL}/heroes/`;
    const MILITARY_RANKS_URL = `${window.API_BASE_URL}/military-ranks/`;
    const WARS_URL = `${window.API_BASE_URL}/wars/`;

    // Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return 'не указано';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    // Helper function to format service years
    const formatServiceYears = (enlistment, discharge) => {
        if (!enlistment || !discharge) return 'не указано';
        const enlistYear = enlistment.split('-')[0];
        const dischargeYear = discharge.split('-')[0];
        return `${enlistYear}–${dischargeYear}`;
    };

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

    // Get hero_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const heroId = urlParams.get('hero_id');

    if (!heroId) {
        console.error('No hero_id provided in URL');
        return;
    }

    // Fetch hero data
    const heroData = await fetchData(`${HERO_BASE_URL}${heroId}`);
    if (!heroData) {
        console.error('Failed to fetch hero data');
        return;
    }

    // Fetch military ranks and wars data
    const militaryRanks = await fetchData(MILITARY_RANKS_URL) || [];
    const wars = await fetchData(WARS_URL) || [];

    // Map military_rank_id and war_id to titles
    const rank = militaryRanks.find(rank => rank.military_rank_id === heroData.military_rank_id)?.title || 'не указано';
    const war = wars.find(war => war.war_id === heroData.war_id)?.title || 'не указано';

    // Update DOM
    const heroInfo = document.querySelector('.hero-single-info');
    if (!heroInfo) {
        console.error('Hero info container not found');
        return;
    }

    // Combine name, surname, and patronymic with placeholder
    const fullName = `${heroData.name || 'Имя не указано'} ${heroData.surname || 'Фамилия не указано'} ${heroData.patronymic || ''}`.trim() || 'Имя не указано';
    heroInfo.querySelector('.hero-single-title').textContent = fullName;
    heroInfo.querySelector('.hero-single-location').textContent = `Место рождения: ${heroData.birth_place || 'не указано'}`;
    heroInfo.querySelector('.hero-single-date-birth').textContent = `Дата рождения: ${formatDate(heroData.birth_date)}`;
    heroInfo.querySelector('.hero-single-date-death').textContent = `Дата смерти: ${formatDate(heroData.death_date)}`;
    heroInfo.querySelector('.hero-single-specialty').textContent = `Воинская специальность: ${heroData.military_specialty || 'не указано'}`;
    heroInfo.querySelector('.hero-single-rank').textContent = `Воинское звание: ${rank}`;
    heroInfo.querySelector('.hero-single-war').textContent = `Война: ${war}`;
    heroInfo.querySelector('.hero-single-years').textContent = `Годы службы: ${formatServiceYears(heroData.enlistment_date, heroData.discharge_date)}`;
    heroInfo.querySelector('.hero-single-additional').textContent = `Дополнительная информация: ${heroData.additional_information || 'не указано'}`;

    // Update hero image
    const heroImage = document.querySelector('.hero-single-image img');
    if (heroImage) {
        const hasPhoto = heroData.photo_name && heroData.photo_name.trim() !== '';
        heroImage.src = hasPhoto ? `${HERO_BASE_URL}${heroId}/photo` : 'assets/photo/soldier.svg';
        heroImage.alt = hasPhoto ? `Photo of ${heroData.name || ''} ${heroData.surname || ''}`.trim() : '';
    } else {
        console.warn('Hero image element not found');
    }
});