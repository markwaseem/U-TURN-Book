function extractYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] || null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function isYouTubeUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === 'youtu.be' || host === 'youtube.com' || host === 'm.youtube.com';
  } catch {
    return false;
  }
}

function setYouTubeThumbnail(img, videoId) {
  const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const max = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  img.onerror = () => {
    img.onerror = null;
    img.src = hq;
  };
  img.src = max;
}

async function fetchYouTubeOEmbedThumbnail(url, img) {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!response.ok) return;

    const data = await response.json();
    if (data.thumbnail_url) {
      img.src = data.thumbnail_url;
    }
  } catch {
    // Keep placeholder when oEmbed is unavailable.
  }
}

function applyYouTubeThumbnails() {
  document.querySelectorAll('.resource-card').forEach((card) => {
    const link = card.querySelector('.resource-link[href]');
    const img = card.querySelector('.resource-thumb img');
    if (!link || !img) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || !isYouTubeUrl(href)) return;

    const videoId = extractYouTubeVideoId(href);
    if (videoId) {
      setYouTubeThumbnail(img, videoId);
      return;
    }

    if (href.includes('list=')) {
      fetchYouTubeOEmbedThumbnail(href, img);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyYouTubeThumbnails();

  const resources = document.querySelector('.resources');
  if (!resources) return;

  const cards = [...resources.querySelectorAll('.resource-card')];
  const countEl = document.querySelector('.resources-count');
  const searchInput = document.querySelector('.resources-search input');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const emptyState = document.querySelector('.resources-empty');

  let activeFilter = 'all';
  let searchQuery = '';

  function cardMatchesSearch(card) {
    if (!searchQuery) return true;
    const haystack = (card.dataset.search || card.textContent).toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  }

  function cardMatchesFilter(card) {
    if (activeFilter === 'all') return true;
    return (card.dataset.type || 'article') === activeFilter;
  }

  function updateView() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = cardMatchesFilter(card) && cardMatchesSearch(card);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;

    if (countEl) {
      countEl.textContent = visibleCount === cards.length
        ? `${cards.length} موارد`
        : `${visibleCount} من ${cards.length} مورد`;
    }
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeFilter = tab.dataset.filter || 'all';
      filterTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      updateView();
    });
  });

  searchInput?.addEventListener('input', (event) => {
    searchQuery = event.target.value.trim();
    updateView();
  });

  updateView();
});
