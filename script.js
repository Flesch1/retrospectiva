let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const daysCountElement = document.getElementById('days-count');
const typewriterElement = document.getElementById('typewriter-text');

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
    slides[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    updateDots();

    // Gatilhos para animações específicas quando a tela entra
    if (slides[currentSlide].id === 'counter') {
        animateDaysCount();
    }
    
    if (slides[currentSlide].id === 'quotes') {
        startTypewriter();
    }
}

function restart() {
    goToSlide(0);
}

// Animação do Contador de Dias
function animateDaysCount() {
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let start = 0;
    const duration = 2500; // 2.5 segundos
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Efeito de easing out para o número desacelerar no final
        const easeOutQuad = t => t * (2 - t);
        const currentCount = Math.floor(easeOutQuad(progress) * diffDays);
        
        daysCountElement.textContent = currentCount;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
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
        dot.addEventListener('click', () => goToSlide(index));
    });
});
