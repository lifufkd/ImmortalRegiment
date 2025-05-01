
    const video = document.querySelector('.banner-video');
    const playButton = document.querySelector('.play-button');

    playButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playButton.style.opacity = '0'; // Скрываем кнопку при воспроизведении
        } else {
            video.pause();
            playButton.style.opacity = '1'; // Показываем кнопку при паузе
        }
    });

    // Показываем кнопку воспроизведения, если видео на паузе
    video.addEventListener('pause', () => {
        playButton.style.opacity = '1';
    });

    video.addEventListener('play', () => {
        playButton.style.opacity = '0';
    });
