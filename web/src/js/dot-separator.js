// Функция для генерации точек
function generateDots(count) {
    return '•'.repeat(count);
}

// Обработка navbar-custom (горизонтальные точки под хедером)
function updateNavbarDots() {
    const navbarCustom = document.querySelector('.navbar-custom');
    if (!navbarCustom) return;

    // Удаляем существующий элемент с точками
    const existingDots = navbarCustom.querySelector('.dots-container');
    if (existingDots) existingDots.remove();

    // Создаем контейнер для точек
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots-container';

    // Получаем ширину с учетом padding
    const computedStyle = window.getComputedStyle(navbarCustom);
    const navbarWidth = navbarCustom.offsetWidth - 
        parseFloat(computedStyle.paddingLeft) - 
        parseFloat(computedStyle.paddingRight);

    // Расчет количества точек
    const dotSize = 18; // font-size
    const spacing = 8;  // letter-spacing
    const totalDotWidth = dotSize + spacing;
    const dotsCount = Math.max(Math.floor(navbarWidth / totalDotWidth), 1);

    dotsContainer.textContent = generateDots(dotsCount);

    // Стили
    dotsContainer.style.cssText = `
        width: 100%;
        text-align: center;
        font-size: 18px;
        letter-spacing: 8px;
        color: black;
        margin-top: 5px;
        white-space: nowrap;
        overflow: hidden;
    `;

    navbarCustom.appendChild(dotsContainer);
}

// Обработка dot-separator-header (вертикальные точки между логотипом и меню)
function updateDotSeparators() {
    const separators = document.querySelectorAll('.dot-separator-header');
    separators.forEach(separator => {
        // Удаляем старые точки, если есть
        separator.innerHTML = '';

        // Вычисляем высоту контейнера
        const parent = separator.closest('.container-fluid');
        const height = parent ? parent.offsetHeight : separator.offsetHeight;
        
        // Расчет количества точек
        const dotHeight = 18; // font-size
        const spacing = 6;   // letter-spacing
        const totalDotHeight = dotHeight + spacing;
        const dotsCount = Math.max(Math.floor(height / totalDotHeight), 1);

        separator.textContent = generateDots(dotsCount);
    });
}

// Обновление при загрузке и изменении размера
window.addEventListener('load', () => {
    updateNavbarDots();
    updateDotSeparators();
});

window.addEventListener('resize', () => {
    updateNavbarDots();
    updateDotSeparators();
});