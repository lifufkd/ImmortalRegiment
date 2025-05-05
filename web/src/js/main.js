        // Configuration
        const API_URL = 'http://127.0.0.1:8000/heroes/random'; // Base endpoint for paginated data
        const PHOTO_BASE_URL = 'http://127.0.0.1:8000/heroes/'; // Base for photo URL
        const INTERVAL = 1000; // 5 seconds

        // Function to fetch data for a specific page
        const fetchPageData = async (page, size) => {
            try {
                const response = await axios.get(API_URL, {
                    params: {
                        page: page,
                        size: size
                    }
                });
                return response.data;
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error.message);
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
                const imgElement = document.querySelector(`${slot} img`);
                imgElement.src = '';
                imgElement.alt = 'Hero Photo';
            });

            // Update images for available heroes (up to 5)
            heroes.slice(0, 5).forEach((hero, index) => {
                if (hero && hero.hero_id && hero.photo_name) {
                    const imgElement = document.querySelector(`${slots[index]} img`);
                    const photoUrl = `${PHOTO_BASE_URL}${hero.hero_id}/photo`;
                    imgElement.src = photoUrl;
                    imgElement.alt = `Photo of ${hero.name} ${hero.surname}`;
                }
            });
        };

        // Main function to cycle through pages and items
        const cycleThroughHeroes = async () => {
            let currentPage = 1;
            let items = [];
            
            while (true) {
                // Fetch new data if items are empty
                const data = await fetchPageData(currentPage, 5);
                items = data.items || [];
                

                // Update gallery with up to 5 heroes
                if (items.length > 0) {
                    updateGalleryImage(items.slice(0, 5));
                    // Remove displayed items
                    items = items.slice(5);
                } else {
                    updateGalleryImage([]); // Clear gallery if no items
                }

                // Wait for 5 seconds
                await new Promise(resolve => setTimeout(resolve, INTERVAL));
            }
        };

        // Start the cycling process
        cycleThroughHeroes().catch(error => {
            console.error('Error in cycleThroughHeroes:', error.message);
        });
    