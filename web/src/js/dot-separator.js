function renderDots() {
    const containers = document.getElementsByClassName('dots');
    const char = '• ';
  
    // Создаём временный элемент для измерения ширины символа
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.textContent = char;
    document.body.appendChild(tempSpan);
  
    // Получаем ширину окна и ширину символа
    const containerWidth = window.innerWidth;
    const charWidth = tempSpan.offsetWidth;
  
    document.body.removeChild(tempSpan);
    const count = Math.floor(containerWidth / charWidth);
    const line = char.repeat(count);
  
    // Применяем ко всем элементам
    for (let i = 0; i < containers.length; i++) {
      const el = containers[i];
      el.textContent = line;
    }
  }
  window.addEventListener('resize', renderDots);
  window.addEventListener('load', renderDots);