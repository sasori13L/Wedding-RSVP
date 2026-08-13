// ============================================================
// Jan Axl & Maribel — Wedding Invitation interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const carouselImgs = Array.from(document.querySelectorAll('.carousel-img'));

  if (lightbox && lightboxImage && carouselImgs.length) {
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const img = carouselImgs[currentIndex];
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showRelative(direction) {
      currentIndex = (currentIndex + direction + carouselImgs.length) % carouselImgs.length;
      const img = carouselImgs[currentIndex];
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
    }

    carouselImgs.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => showRelative(-1));
    lightboxNext?.addEventListener('click', () => showRelative(1));

    // Click outside the image (on the dark backdrop) also closes it
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support while lightbox is open
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showRelative(-1);
      if (e.key === 'ArrowRight') showRelative(1);
    });
  }

  /* ---------- Carousel ---------- */
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDotsWrap = document.getElementById('carouselDots');

  if (carouselTrack && carouselDotsWrap) {
    const slides = Array.from(carouselTrack.children);

    // Build dot indicators
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      carouselDotsWrap.appendChild(dot);
      return dot;
    });

    function setActiveDot() {
      const trackCenter = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === closestIndex));
    }

    setActiveDot();
    carouselTrack.addEventListener('scroll', () => {
      window.requestAnimationFrame(setActiveDot);
    }, { passive: true });

    function scrollByOneSlide(direction) {
      const slide = slides[0];
      const gap = 16;
      const distance = (slide.clientWidth + gap) * direction;
      carouselTrack.scrollBy({ left: distance, behavior: 'smooth' });
    }

    carouselPrev?.addEventListener('click', () => scrollByOneSlide(-1));
    carouselNext?.addEventListener('click', () => scrollByOneSlide(1));
  }

  /* ---------- Background music ---------- */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  function setPlayingState(isPlaying) {
    if (!musicToggle) return;
    musicToggle.classList.toggle('is-playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  }

  if (bgMusic && musicToggle) {
    let hasUnmutedOnce = false;

    // Browsers allow silent (muted) autoplay, so start the track muted
    // right away. The button still shows "play" since there's no sound yet.
    bgMusic.muted = true;
    bgMusic.play().catch(() => {
      // Even muted autoplay was blocked; it will simply start on first interaction below.
    });

    function unmuteAndPlay() {
      if (hasUnmutedOnce) return;
      hasUnmutedOnce = true;
      bgMusic.muted = false;
      bgMusic.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
    }

    // The very first tap/click/scroll/keypress anywhere on the page
    // unmutes the already-running track, so it feels like it "was playing" all along.
    ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
      document.addEventListener(evt, unmuteAndPlay, { once: true, passive: true });
    });

    // Manual toggle button: also counts as the unmute interaction, then behaves as play/pause
    musicToggle.addEventListener('click', () => {
      if (!hasUnmutedOnce) {
        unmuteAndPlay();
        return;
      }
      if (bgMusic.paused) {
        bgMusic.play().then(() => setPlayingState(true)).catch(() => { });
      } else {
        bgMusic.pause();
        setPlayingState(false);
      }
    });
  }

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 300);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(() => loader && loader.classList.add('hidden'), 2000);

  /* ---------- Scroll cue ---------- */
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Countdown timer ---------- */
  // Wedding date/time: October 9, 2026, 2:00 PM (Philippine Time, UTC+8)
  const WEDDING_DATE = new Date('2026-10-09T14:00:00+08:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = WEDDING_DATE - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Scroll reveal for sections ---------- */
  const revealEls = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

});