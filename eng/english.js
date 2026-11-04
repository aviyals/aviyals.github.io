const overview = document.getElementById('english-overview');
const topics = document.getElementById('topics');
const dailyEnglish = document.getElementById('daily-english');
const reviewEdible = document.getElementById('review-edible'); // Registered review section

// Select navigation links
const linksMap = new Map([
  ['topics', document.querySelector('.main-nav a[href="#topics"]')],
  ['daily-english', document.querySelector('.main-nav a[href="#daily-english"]')],
  ['review-edible', document.getElementById('review-main-link')]
]);

function syncEnglishView() {
  const hash = window.location.hash.slice(1);
  const target = document.getElementById(hash);
  
  // Determine states
  const isTopics = target !== null && (target === topics || topics.contains(target));
  const isDailyEnglish = hash === 'daily-english';
  // Activates if hash is #review-edible OR any sub-dropdown item inside it
  const isReview = hash.startsWith('review-'); 

  // Toggle visibility of main sections
  overview.hidden = isTopics || isDailyEnglish || isReview;
  topics.hidden = !isTopics;
  dailyEnglish.hidden = !isDailyEnglish;
  if (reviewEdible) reviewEdible.hidden = !isReview;

  // Update navigation links state
  const activeStates = {
    'topics': isTopics,
    'daily-english': isDailyEnglish,
    'review-edible': isReview
  };

  for (const [key, link] of linksMap.entries()) {
    if (!link) continue;
    
    const isActive = activeStates[key];
    link.classList.toggle('active', isActive);
    
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  // Global event notification
  document.dispatchEvent(new Event('docuhub:viewchange'));

  // Scroll to target if view is active
  if (target && (isTopics || isDailyEnglish || isReview)) {
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

window.addEventListener('hashchange', syncEnglishView);
syncEnglishView();