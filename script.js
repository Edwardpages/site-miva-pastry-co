const script = () => {
  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Navbar behavior
  const navbar = document.querySelector('nav');
  let lastScrollTop = 0;

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;

    // Shrink and add blur after 80px
    if (scrollTop > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll up/down
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
  };

  window.addEventListener('scroll', handleScroll);

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // Stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const endValue = parseInt(entry.target.textContent);
        let startValue = 0;
        const duration = 2000;
        const increment = endValue / (duration / 16);

        const timer = setInterval(() => {
          startValue += increment;
          if (startValue >= endValue) {
            entry.target.textContent = endValue;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.ceil(startValue);
          }
        }, 16);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
  });

  // Gallery lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close">&times;</button>
    <button class="lightbox-prev">&#10094;</button>
    <img src="" alt="" class="lightbox-img">
    <button class="lightbox-next">&#10095;</button>
  `;
  document.body.appendChild(lightbox);

  const galleryImages = document.querySelectorAll('.gallery img');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const imgSrc = galleryImages[index].src;
    lightbox.querySelector('.lightbox-img').src = imgSrc;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightbox.querySelector('.lightbox-img').src = galleryImages[currentIndex].src;
  });

  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightbox.querySelector('.lightbox-img').src = galleryImages[currentIndex].src;
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Form validation and success message
  const form = document.querySelector('form');
  const successMessage = document.createElement('div');
  successMessage.className = 'form-success';
  successMessage.textContent = 'Form submitted successfully!';
  successMessage.style.display = 'none';
  form.parentNode.insertBefore(successMessage, form.nextSibling);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--accent)';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });

    if (isValid) {
      form.style.display = 'none';
      successMessage.style.display = 'block';
      successMessage.style.opacity = '0';
      
      setTimeout(() => {
        successMessage.style.transition = 'opacity 0.5s';
        successMessage.style.opacity = '1';
      }, 10);
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 
                         (navbar.classList.contains('scrolled') ? 80 : 100);
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (hamburger.classList.contains('open')) {
          hamburger.classList.remove('open');
          navMenu.classList.remove('open');
        }
      }
    });
  });
};

// Run after DOM loads
document.addEventListener('DOMContentLoaded', script);