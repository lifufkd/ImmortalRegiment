const slidesContainer = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let currentSlide = 0;

// Клонируем первый и последний слайды для бесшовной прокрутки
const firstSlideClone = slides[0].cloneNode(true);
const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
slidesContainer.appendChild(firstSlideClone); // Клон первого в конец
slidesContainer.insertBefore(lastSlideClone, slides[0]); // Клон последнего в начало

// Устанавливаем начальную позицию (с учетом клона в начале)
slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;

// Функция для обновления позиции слайдов
function updateSlidePosition() {
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;
}

// Кнопка "вперед"
document.querySelector('.carousel-button.next').addEventListener('click', () => {
    currentSlide++;
    updateSlidePosition();

    if (currentSlide === totalSlides) {
        setTimeout(() => {
            slidesContainer.style.transition = 'none';
            currentSlide = 0;
            slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;
        }, 500); // Совпадает с длительностью анимации
    }
});

// Кнопка "назад"
document.querySelector('.carousel-button.prev').addEventListener('click', () => {
    currentSlide--;
    updateSlidePosition();

    if (currentSlide === -1) {
        setTimeout(() => {
            slidesContainer.style.transition = 'none';
            currentSlide = totalSlides - 1;
            slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;
        }, 500); // Совпадает с длительностью анимации
    }
});

// Обработчик окончания анимации для дополнительной надежности
slidesContainer.addEventListener('transitionend', () => {
    if (currentSlide === totalSlides) {
        slidesContainer.style.transition = 'none';
        currentSlide = 0;
        slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;
    } else if (currentSlide === -1) {
        slidesContainer.style.transition = 'none';
        currentSlide = totalSlides - 1;
        slidesContainer.style.transform = `translateX(-${100 * (currentSlide + 1)}%)`;
    }
});