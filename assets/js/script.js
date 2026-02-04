(() => {
  const yesButton = document.querySelector('[data-yes]');
  const noButton = document.querySelector('[data-no]');
  const card = document.querySelector('[data-card]');
  const success = document.querySelector('[data-success]');

  if (!yesButton || !noButton || !card || !success) {
    return;
  }

  const GUTTER = 24;
  const RANGE_RATIO = 0.35;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Relocate the "No" button to a random safe spot inside the viewport.
  const moveNoButton = () => {
    const rect = noButton.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const availableX = Math.max(0, vw - rect.width - GUTTER * 2);
    const availableY = Math.max(0, vh - rect.height - GUTTER * 2);
    const travelX = availableX * RANGE_RATIO;
    const travelY = availableY * RANGE_RATIO;
    const baseX = GUTTER + (availableX - travelX) / 2;
    const baseY = GUTTER + (availableY - travelY) / 2;
    const randomX = baseX + Math.random() * travelX;
    const randomY = baseY + Math.random() * travelY;

    noButton.classList.add('is-floating');
    noButton.style.setProperty('--no-x', `${randomX}px`);
    noButton.style.setProperty('--no-y', `${randomY}px`);
  };

  // Prevent iOS from treating a tap as a click so the button can escape first.
  const handleTouch = (event) => {
    event.preventDefault();
    moveNoButton();
  };

  noButton.addEventListener('mouseenter', moveNoButton);
  noButton.addEventListener('touchstart', handleTouch, { passive: false });

  // Celebrate the "Yes" response with a smooth reveal.
  yesButton.addEventListener('click', () => {
    card.classList.add('is-hidden');
    success.classList.add('is-visible');
    success.removeAttribute('aria-hidden');

    window.setTimeout(() => {
      success.focus({ preventScroll: true });
    }, 320);
  });

  // Keep the runaway button inside bounds if the device rotates or resizes.
  window.addEventListener('resize', () => {
    if (!noButton.classList.contains('is-floating')) {
      return;
    }

    const rect = noButton.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clampedX = clamp(rect.left, GUTTER, vw - rect.width - GUTTER);
    const clampedY = clamp(rect.top, GUTTER, vh - rect.height - GUTTER);

    noButton.style.setProperty('--no-x', `${clampedX}px`);
    noButton.style.setProperty('--no-y', `${clampedY}px`);
  });
})();
