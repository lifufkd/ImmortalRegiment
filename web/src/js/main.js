document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const API_URL = `${window.API_BASE_URL}/heroes/random`; // Base endpoint for random heroes
    const PHOTO_BASE_URL = `${window.API_BASE_URL}/heroes/`; // Base for photo URL
    const INTERVAL = window.LONG_POLLING_DELAY; // 5 seconds (increased for stability)

    // Check if gallery container exists
    const galleryContainer = document.querySelector('.heroes-gallery');
    if (!galleryContainer) {
        console.error('Gallery container (.heroes-gallery) not found in DOM');
        return;
    }

    // Function to fetch data for a specific page
    const fetchPageData = async (page, size) => {
        try {
            console.log(`Fetching page ${page} with size ${size} from ${API_URL}`);
            const response = await axios.get(API_URL, {
                params: {
                    page: 1,
                    size: size
                }
            });
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            return null;
        }
    };

    // Function to update the gallery with hero photos
    const updateGalleryImage = (heroes) => {
        // Define gallery slots
        const slots = [
            '.heroes-gallery__single--top-left',
            '.heroes-gallery__single--center',
            '.heroes-gallery__single--top-right',
            '.heroes-gallery__single--bottom-left',
            '.heroes-gallery__single--bottom-right'
        ];

        // Clear all images first
        slots.forEach(slot => {
            const slotElement = document.querySelector(slot);
            if (!slotElement) {
                console.warn(`Slot ${slot} not found in DOM`);
                return;
            }
            const imgElement = slotElement.querySelector('img');
            if (imgElement) {
                imgElement.src = '';
                imgElement.alt = 'Hero Photo';
            } else {
                console.warn(`No <img> element found in slot ${slot}`);
            }
            slotElement.style.cursor = 'auto';
            slotElement.onclick = null;
        });

        // Update images for available heroes (up to 5)
        heroes.slice(0, 5).forEach((hero, index) => {
            if (index < slots.length && hero && hero.hero_id && hero.photo_name && hero.photo_name.trim() !== '') {
                const slotElement = document.querySelector(slots[index]);
                if (!slotElement) {
                    console.warn(`Slot ${slots[index]} not found during update`);
                    return;
                }
                const imgElement = slotElement.querySelector('img');
                if (imgElement) {
                    const photoUrl = `${PHOTO_BASE_URL}${hero.hero_id}/photo`;
                    imgElement.src = photoUrl;
                    imgElement.alt = `Photo of ${hero.name} ${hero.surname}`;
                    slotElement.style.cursor = 'pointer';
                    slotElement.onclick = () => {
                        console.log(`Navigating to gallery-single.html?hero_id=${hero.hero_id}`);
                        window.location.href = `gallery-single.html?hero_id=${hero.hero_id}`;
                    };
                } else {
                    console.warn(`Skipping slot ${slots[index]}: No valid <img> element found`);
                }
            }
        });
    };

    // Main function to cycle through pages and items
    const cycleThroughHeroes = async () => {
        let currentPage = 1;
        let items = [];

        while (true) {
            // Fetch new data if items are empty
            if (items.length < 5) {
                const data = await fetchPageData(currentPage, 5);
                if (data) {
                    // Filter out heroes with null or empty photo_name
                    items = (data.items || []).filter(hero => hero.photo_name && hero.photo_name.trim() !== '');
                    console.log(`Filtered items:`, items);
                    currentPage++;
                } else {
                    items = [];
                }
            }

            // Update gallery with up to 5 heroes
            if (items.length > 0) {
                console.log(`Displaying heroes:`, items.slice(0, 5));
                updateGalleryImage(items.slice(0, 5));
                // Remove displayed items


                items = items.slice(5);
            } else {
                console.log('No valid items to display');
                updateGalleryImage([]); // Clear gallery if no items
            }

            // Wait for interval
            console.log(`Waiting ${INTERVAL/1000} seconds before next update...`);
            await new Promise(resolve => setTimeout(resolve, INTERVAL));
        }
    };

    // Start the cycling process
    console.log('Starting cycleThroughHeroes...');
    cycleThroughHeroes().catch(error => {
        console.error('Error in cycleThroughHeroes:', error.message);
    });
});