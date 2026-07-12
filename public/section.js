document.addEventListener('DOMContentLoaded', () => {
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
