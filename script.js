// ==================================================
// SCRIPT PRINCIPAL - EL BÁRBARO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {

  // ========== SPLASH SCREEN ==========
  const splash = document.getElementById('splash-screen');
  const mainContent = document.getElementById('main-content');

  function hideSplash() {
    splash.classList.add('hidden');
    setTimeout(() => {
      splash.style.display = 'none';
      mainContent.style.display = 'block';
      // Inicializar animaciones después de mostrar contenido
      initApp();
    }, 1200); // Coincide con la transición CSS
  }

  // Mostrar splash por 3.5 segundos
  setTimeout(hideSplash, 3500);

  // También permitir hacer clic para saltar
  splash.addEventListener('click', hideSplash);

  // ========== INICIALIZACIÓN DE LA APP ==========
  function initApp() {
    // Scroll suave para enlaces internos
    const navLinks = document.querySelectorAll('.navbar-nav a.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Cerrar menú móvil si está abierto
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
          }
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Intersection Observer para animaciones
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Efecto parallax en hero (solo si no hay video, o se puede aplicar al overlay)
    const hero = document.querySelector('.hero-section');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (window.innerWidth > 768) {
          // Si no usas video, puedes mover la imagen de fondo
          // hero.style.backgroundPositionY = `${scrollY * 0.6}px`;
        }
      });
    }

    // Active nav link según scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');

    function setActiveLink() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === current) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // Navbar cambia de color al scrollear
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = '#000000';
        navbar.style.backdropFilter = 'none';
      } else {
        navbar.style.background = 'rgba(0,0,0,0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
      }
    });

    // Efecto de clic en botones
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
      btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });

    // Forzar la reproducción del video en móviles (si es necesario)
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      // En móviles, a veces los videos con autoplay no funcionan, pero lo intentamos
      heroVideo.play().catch(e => console.log('Autoplay bloqueado:', e));
    }
  }

  // Si por algún casual el splash ya está oculto
  if (splash.classList.contains('hidden')) {
    mainContent.style.display = 'block';
    initApp();
  }
});