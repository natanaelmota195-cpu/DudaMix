const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const cursor = document.getElementById('cursor');
const buttons = document.querySelectorAll('a, button');
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const galleryImages = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const countdown = document.getElementById('countdown');
const contactForm = document.getElementById('contactForm');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card[data-category]');
const menuEmpty = document.querySelector('.menu-empty');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('loaded');
    preloader.style.display = 'none';
  }, 900);
  lazyLoadImages();
  revealOnScroll();
  requestAnimationFrame(() => revealOnScroll());
  // animação de entrada do conteúdo principal do Hero
  const heroCopy = document.getElementById('heroCopy');
  if (heroCopy) heroCopy.classList.add('animate-in');

  // garantir que o vídeo do hero comece (muted autoplay deve permitir reprodução)
  const heroVideo = document.querySelector('.hero-video');
 if(heroVideo && typeof heroVideo.play === 'function') {
    const p = heroVideo.play();
    if (p && p.then) p.catch(() => {/* autoplay pode ser bloqueado; sem controles conforme solicitado */});
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  revealOnScroll();
});

window.addEventListener('mousemove', (event) => {
  cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

buttons.forEach((btn) => {
  btn.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  btn.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

function revealOnScroll() {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.82) {
      el.classList.add('active');
    }
  });
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + ((7 - targetDate.getDay()) % 7 || 7));
targetDate.setHours(23, 59, 59, 999);

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

galleryImages.forEach((img) => {
  img.addEventListener('click', () => {
    lightbox.classList.add('active');
    lightboxImg.src = img.src;
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  fetch(contactForm.action, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((html) => {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      contactForm.reset();
    })
    .catch(() => {
      alert('Houve um erro ao enviar. Tente novamente mais tarde.');
    });
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const category = button.dataset.category;
    let visibleCards = 0;

    categoryButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    menuCards.forEach((card) => {
      const isVisible = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCards += 1;
    });

    menuEmpty.hidden = visibleCards > 0;
  });
});

const menuHighlights = [
  {
    image: 'https://images.unsplash.com/photo-1505253210343-53f24944249b?auto=format&fit=crop&w=900&q=80',
    label: 'Mais vendido',
    title: 'Duda Mix Signature',
    description: 'Sorvete especial com red velvet, chocolate belga e calda de frutas vermelhas.',
    stars: '★★★★★',
  },
  {
    image: 'https://images.unsplash.com/photo-1599785209707-4af0d4b6ef90?auto=format&fit=crop&w=900&q=80',
    label: 'Mais vendido',
    title: 'Milk-shake Pink Passion',
    description: 'Milk-shake cremoso com toque de baunilha e espuma rosa intensa.',
    stars: '★★★★★',
  },
];

function renderFeaturedCards() {
  const featuredRoot = document.getElementById('react-root');
  if (!featuredRoot || typeof ReactDOM === 'undefined') return;
  const root = ReactDOM.createRoot(featuredRoot);
  const Featured = () => {
    return React.createElement(
      'div',
      { className: 'react-grid' },
      menuHighlights.map((item, idx) =>
        React.createElement(
          'article',
          { className: 'featured-card reveal-right', key: idx },
          React.createElement('img', { src: item.image, alt: item.title, loading: 'lazy' }),
          React.createElement(
            'div',
            { className: 'featured-info' },
            React.createElement('span', null, item.label),
            React.createElement('h3', null, item.title),
            React.createElement('p', null, item.description),
            React.createElement('div', { className: 'featured-stars' }, item.stars)
          )
        )
      )
    );
  };
  root.render(React.createElement(Featured));
}

renderFeaturedCards();

const floatingItems = document.querySelectorAll('.floating');
floatingItems.forEach((item, index) => {
  item.style.animationDelay = `${index * 0.3}s`;
});
