(function initJourneyPath() {
  const path = document.querySelector('.journey-path');
  if (!path || path.classList.contains('is-visible')) return;

  function reveal() {
    path.classList.add('is-visible');
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(path);

    const rect = path.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(reveal);
      });
    }

    return;
  }

  reveal();
})();
