let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const daysCountElement    = document.getElementById('days-count');
const hoursCountElement   = document.getElementById('hours-count');
const minutesCountElement = document.getElementById('minutes-count');
const secondsCountElement = document.getElementById('seconds-count');
const typewriterElement = document.getElementById('typewriter-text');

// === Galeria de fotos ===
let currentPhoto = 0;
let carouselTimer = null;
const CAROUSEL_INTERVAL = 4000;

function getPhotoItems() { return document.querySelectorAll('.photo-item'); }
function getCDots()      { return document.querySelectorAll('.c-dot'); }

function goToPhoto(n) {
    const items = getPhotoItems();
    const cdots = getCDots();
    if (!items.length) return;
    items[currentPhoto].classList.remove('active');
    cdots[currentPhoto].classList.remove('active');
    currentPhoto = ((n % items.length) + items.length) % items.length;
    items[currentPhoto].classList.add('active');
    cdots[currentPhoto].classList.add('active');
}

function changePhoto(dir) {
    goToPhoto(currentPhoto + dir);
    resetCarousel();
}

function startCarousel() {
    stopCarousel();
    carouselTimer = setInterval(() => goToPhoto(currentPhoto + 1), CAROUSEL_INTERVAL);
}

function stopCarousel() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}

function resetCarousel() {
    stopCarousel();
    startCarousel();
}

// Chuva de Corações
const HEART_EMOJIS = ['❤️', '🩷', '💕', '💖', '💗', '💓'];
let heartInterval = null;

function createHeart() {
    const container = document.getElementById('hearts-container');
    if (!container) return;
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    heart.style.left = (Math.random() * 100) + 'vw';
    const size = (Math.random() * 1.6 + 0.8).toFixed(2);
    heart.style.fontSize = size + 'rem';
    const duration = (Math.random() * 4 + 4).toFixed(2);
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = '0s';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), parseFloat(duration) * 1000 + 200);
}

function startHeartRain() {
    stopHeartRain();
    // Burst inicial
    for (let i = 0; i < 10; i++) setTimeout(createHeart, i * 120);
    heartInterval = setInterval(createHeart, 350);
}

function stopHeartRain() {
    if (heartInterval) { clearInterval(heartInterval); heartInterval = null; }
    const container = document.getElementById('hearts-container');
    if (container) container.innerHTML = '';
}
let carouselTouchStartX = 0;
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.photo-track');
    if (track) {
        track.addEventListener('touchstart', (e) => {
            carouselTouchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = carouselTouchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                changePhoto(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }
});

// Configurações personalizadas
const startDate = new Date('2026-04-10'); // Data de início do relacionamento
const quotes = [
    "\"Sweetest of the sunflowers, yeah, you're the sun to me\"",
    "\"You're the sight of utmost beuty, utmost strength and utmost loyalty\"",
    "\"From the moment you wake me up til you kiss me goodnight, everything that you do, it makes me want more of you\""
];

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(n) {
    const outgoing = slides[currentSlide];

    // Dispara a animação de saída
    outgoing.classList.remove('active');
    outgoing.classList.add('leaving');
    setTimeout(() => outgoing.classList.remove('leaving'), 500);

    currentSlide = n;
    slides[currentSlide].classList.add('active');
    updateDots();

    // Gatilhos para animações específicas quando a tela entra
    if (slides[currentSlide].id === 'counter') {
        animateDaysCount();
    } else {
        stopLiveCounter();
    }
    
    if (slides[currentSlide].id === 'gallery') {
        currentPhoto = 0;
        goToPhoto(0);
        startCarousel();
    } else {
        stopCarousel();
    }

    if (slides[currentSlide].id === 'final') {
        startHeartRain();
    } else {
        stopHeartRain();
    }

    if (slides[currentSlide].id === 'quotes') {
        startTypewriter();
    }
}

function restart() {
    goToSlide(0);
}

// Animação do Contador de Dias e Horas
let liveCounterInterval = null;

function getCounterValues() {
    const diffTime = Math.abs(new Date() - startDate);
    return {
        days:    Math.floor(diffTime / (1000 * 60 * 60 * 24)),
        hours:   Math.floor(diffTime / (1000 * 60 * 60)),
        minutes: Math.floor(diffTime / (1000 * 60)),
        seconds: Math.floor(diffTime / 1000)
    };
}

function setCounterDisplay(v) {
    daysCountElement.textContent    = v.days.toLocaleString('pt-BR');
    hoursCountElement.textContent   = v.hours.toLocaleString('pt-BR');
    minutesCountElement.textContent = v.minutes.toLocaleString('pt-BR');
    secondsCountElement.textContent = v.seconds.toLocaleString('pt-BR');
}

function animateDaysCount() {
    const target = getCounterValues();
    const duration = 2500;
    const startTime = performance.now();
    const easeOutQuad = t => t * (2 - t);

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = easeOutQuad(progress);

        setCounterDisplay({
            days:    Math.floor(eased * target.days),
            hours:   Math.floor(eased * target.hours),
            minutes: Math.floor(eased * target.minutes),
            seconds: Math.floor(eased * target.seconds)
        });

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            startLiveCounter();
        }
    }

    requestAnimationFrame(update);
}

function startLiveCounter() {
    stopLiveCounter();
    liveCounterInterval = setInterval(() => setCounterDisplay(getCounterValues()), 1000);
}

function stopLiveCounter() {
    if (liveCounterInterval) { clearInterval(liveCounterInterval); liveCounterInterval = null; }
}

// Efeito de Typewriter
let quoteIndex = 0;
let charIndex = 0;
let isTyping = false;

function startTypewriter() {
    if (isTyping) return;
    isTyping = true;
    typewriterElement.textContent = "";
    charIndex = 0;
    type();
}

function type() {
    const currentQuote = quotes[quoteIndex];
    
    if (charIndex < currentQuote.length) {
        typewriterElement.textContent += currentQuote.charAt(charIndex);
        charIndex++;
        setTimeout(type, 70);
    } else {
        isTyping = false;
        // Muda para a próxima frase após um tempo
        setTimeout(() => {
            if (slides[currentSlide].id === 'quotes') {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                startTypewriter();
            }
        }, 3000);
    }
}

// Navegação por Scroll (com debounce para não pular muitas telas)
let isThrottled = false;
window.addEventListener('wheel', (e) => {
    if (isThrottled) return;
    
    isThrottled = true;
    if (e.deltaY > 0) nextSlide();
    else prevSlide();
    
    setTimeout(() => {
        isThrottled = false;
    }, 1000);
}, { passive: true });

// Navegação por Teclado
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') nextSlide();
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevSlide();
});

// Suporte para Touch (Mobile)
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}, { passive: true });

// Inicialização de Partículas
function createParticles() {
    const container = document.getElementById('particles-js');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        // Posição aleatória
        p.style.left = Math.random() * 100 + 'vw';
        
        // Tamanho aleatório
        const size = Math.random() * 5 + 2 + 'px';
        p.style.width = size;
        p.style.height = size;
        
        // Animação aleatória
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = Math.random() * 0.5 + 0.2;
        
        container.appendChild(p);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Clique nos dots para navegar
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
        });
    });
});
