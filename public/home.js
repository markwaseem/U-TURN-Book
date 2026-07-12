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

function toArabicNumerals(value) {
  return String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[digit]);
}

function formatResourceTotal(count) {
  const word = count === 1 ? 'مورد' : 'موارد';
  return `${toArabicNumerals(count)} ${word}`;
}

function countResourcesFromDocument(doc) {
  const counts = { all: 0, video: 0, article: 0, pdf: 0 };

  doc.querySelectorAll('.resources .resource-card').forEach((card) => {
    counts.all += 1;
    const type = card.dataset.type || 'article';
    if (type in counts) counts[type] += 1;
  });

  return counts;
}

function updateNavCardStats(card, counts) {
  const totalEl = card.querySelector('[data-stat="total"]');
  const videoEl = card.querySelector('[data-stat="video"]');
  const articleEl = card.querySelector('[data-stat="article"]');
  const pdfEl = card.querySelector('[data-stat="pdf"]');

  if (totalEl) totalEl.textContent = formatResourceTotal(counts.all);
  if (videoEl) videoEl.textContent = `🎬 ${toArabicNumerals(counts.video)} فيديو`;
  if (articleEl) articleEl.textContent = `📄 ${toArabicNumerals(counts.article)} مقال`;
  if (pdfEl) pdfEl.textContent = `📕 ${toArabicNumerals(counts.pdf)} PDF`;
}

async function loadSectionResourceCounts() {
  const navCards = document.querySelectorAll('.nav-card[data-section]');
  if (!navCards.length) return;

  await Promise.all([...navCards].map(async (card) => {
    const sectionPath = card.dataset.section;
    if (!sectionPath) return;

    try {
      const response = await fetch(sectionPath);
      if (!response.ok) return;

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      updateNavCardStats(card, countResourcesFromDocument(doc));
    } catch {
      // Keep static fallback counts when fetch fails.
    }
  }));
}

document.addEventListener('DOMContentLoaded', loadSectionResourceCounts);
