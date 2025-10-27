// Slideshow logic
document.addEventListener('DOMContentLoaded', () => {
  const slideshow = document.querySelector('.slideshow');
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const rhombusContainer = slideshow.querySelector('.rhombus-trails');
  let current = 0;
  let autoTransition; // store interval ID
  let isPaused = false;
  let arrow; // indicator above current thumb

  // Create rhombus previews
  slides.forEach((slide, i) => {
    const thumb = document.createElement('div');
    thumb.style.backgroundImage = slide.style.backgroundImage;
    thumb.classList.add('thumb');
    if (i === 0) thumb.classList.add('active-thumb');
    thumb.addEventListener('click', () => {
      showSlide(i);
      pauseAutoTransition(); // pause when user interacts
    });
    rhombusContainer.appendChild(thumb);
  });

  // Create arrow indicator and position it above the active thumb
  arrow = document.createElement('div');
  arrow.className = 'thumb-arrow';
  // arrow is purely decorative - pointer-events none
  arrow.setAttribute('aria-hidden', 'true');
  rhombusContainer.appendChild(arrow);

  // Create autoplay toggle button (shows pause/play and label)
  const autoplayBtn = document.createElement('button');
  autoplayBtn.className = 'autoplay-toggle';
  autoplayBtn.type = 'button';
  autoplayBtn.setAttribute('aria-pressed', 'false');
  // SVG icons (FontAwesome paths provided)
  const SVG_PLAY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>`;
  const SVG_PAUSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>`;

  autoplayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // toggle autoplay state and reset timer
    if (isPaused) {
      isPaused = false;
      startAutoTransition();
    } else {
      isPaused = true;
      clearInterval(autoTransition);
    }
    updateAutoplayButton();
  });
  rhombusContainer.appendChild(autoplayBtn);

  function updateAutoplayButton() {
  // show SVG pause when autoplay is active (so pressing will pause), and SVG play when paused
  const icon = isPaused ? SVG_PLAY : SVG_PAUSE;
  // label text
  autoplayBtn.innerHTML = `${icon}<span class="autoplay-label">Autoplay</span>`;
  autoplayBtn.setAttribute('aria-pressed', String(!isPaused));
  }
  // initialize button label
  updateAutoplayButton();

  // Ensure page scrolls to bottom on start so thumbs are visible
  // Use setTimeout to allow layout to settle
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // position arrow after scroll/layout
    positionArrow();
  }, 50);

  function showSlide(index) {
  slides[current].classList.remove('active');
  // update thumb active class
  const thumbs = Array.from(rhombusContainer.querySelectorAll('.thumb'));
  thumbs[current].classList.remove('active-thumb');

  current = index;
  slides[current].classList.add('active');
  thumbs[current].classList.add('active-thumb');
  positionArrow();
  }

  function startAutoTransition() {
    clearInterval(autoTransition);
    autoTransition = setInterval(() => {
      if (!isPaused) {
        let next = (current + 1) % slides.length;
        showSlide(next);
      }
    }, 4000);
    updateAutoplayButton();
  }

  function pauseAutoTransition() {
    isPaused = true;
    clearInterval(autoTransition); // stop rotation
  updateAutoplayButton();
  }

  function positionArrow() {
    const thumbs = Array.from(rhombusContainer.querySelectorAll('.thumb'));
    const active = thumbs[current];
    if (!active || !arrow) return;
    // compute center x of active thumb relative to container
    const containerRect = rhombusContainer.getBoundingClientRect();
    const thumbRect = active.getBoundingClientRect();
    const offsetX = thumbRect.left + thumbRect.width / 2 - containerRect.left;
  // place arrow centered above thumb with a smooth transform
  // adjust by +1px to the right to match design request (subtracting half width ~7px then +1)
  arrow.style.transform = `translateX(${offsetX - 9}px)`;
  }

  // Start rotating automatically
  startAutoTransition();
});
