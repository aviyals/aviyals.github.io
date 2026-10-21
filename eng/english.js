const overview = document.getElementById('english-overview');
const topics = document.getElementById('topics');
const dailyEnglish = document.getElementById('daily-english');
const topicsLink = document.querySelector('.main-nav a[href="#topics"]');
const dailyEnglishLink = document.querySelector('.main-nav a[href="#daily-english"]');

function syncEnglishView() {
  const hash = window.location.hash.slice(1);
  const target = document.getElementById(hash);
  const isTopics = target !== null && (target === topics || topics.contains(target));
  const isDailyEnglish = hash === 'daily-english';

  overview.hidden = isTopics || isDailyEnglish;
  topics.hidden = !isTopics;
  dailyEnglish.hidden = !isDailyEnglish;

  for (const [link, active] of [[topicsLink, isTopics], [dailyEnglishLink, isDailyEnglish]]) {
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  if (target && (isTopics || isDailyEnglish)) {
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

window.addEventListener('hashchange', syncEnglishView);
syncEnglishView();
