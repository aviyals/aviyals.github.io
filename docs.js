(() => {
  const themeKey = 'docuhub-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preferredTheme = null;
  try {
    const savedTheme = window.localStorage.getItem(themeKey);
    if (savedTheme === 'light' || savedTheme === 'dark') preferredTheme = savedTheme;
  } catch (error) {
    console.warn('Docuhub could not read the saved theme preference.', error);
  }
  document.documentElement.dataset.theme = preferredTheme || (systemTheme.matches ? 'dark' : 'light');
  const root = new URL('.', document.currentScript.src);
  const url = (path) => new URL(path, root).href;
  const isEnglish = window.location.pathname.endsWith('/eng/index.html')
    || window.location.pathname.endsWith('/eng/');
  const isFun = window.location.pathname.endsWith('/fun/index.html')
    || window.location.pathname.endsWith('/fun/');
  const sectionHome = isEnglish ? 'eng/index.html' : isFun ? 'fun/index.html' : 'tec/index.html';
  const sectionLabel = isEnglish ? 'English' : isFun ? 'Functional' : 'Technical';
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const headerInner = header.querySelector('.header-inner');

  headerInner.innerHTML = `
    <a href="${url(sectionHome)}" class="brand">
      <span class="docs-brand-mark" aria-hidden="true">D</span>
      Docuhub <span class="docs-brand-label">${sectionLabel}</span>
    </a>
    <nav class="main-nav" aria-label="Primary navigation">
      ${isEnglish
        ? '<a href="#english-overview">Overview</a><a href="#topics">Topics</a><a href="#daily-english">Daily English</a>'
        : isFun
          ? '<a href="#overview">Overview</a><a href="#functional-topics">Topics</a>'
          : `<a href="${url('tec/index.html#overview')}">Overview</a>
             <a href="${url('tec/index.html#backend-topics')}">Backend</a>
             <a href="${url('tec/index.html#frontend-topics')}">Frontend</a>
             <a href="${url('tec/index.html#devops-topics')}">DevOps</a>`}
    </nav>
    <button class="docs-theme-button" type="button" aria-label="Dark mode" aria-pressed="false">Dark mode</button>
    <button class="docs-menu-button" type="button" aria-expanded="false" aria-controls="docs-sidebar">Browse docs</button>
  `;

  const themeButton = header.querySelector('.docs-theme-button');
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
  applyTheme(document.documentElement.dataset.theme);
  themeButton.addEventListener('click', () => {
    preferredTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(preferredTheme);
    try {
      window.localStorage.setItem(themeKey, preferredTheme);
      themeButton.removeAttribute('title');
    } catch (error) {
      console.warn('Docuhub could not save the theme preference.', error);
      themeButton.title = 'Theme changed, but your browser could not save the preference.';
    }
  });
  systemTheme.addEventListener('change', (event) => {
    if (!preferredTheme) applyTheme(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== themeKey && event.key !== null) return;
    preferredTheme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    applyTheme(preferredTheme || (systemTheme.matches ? 'dark' : 'light'));
  });

  const shell = document.createElement('div');
  shell.className = 'docs-shell';
  const sidebar = document.createElement('aside');
  sidebar.id = 'docs-sidebar';
  sidebar.className = 'docs-sidebar';
  sidebar.innerHTML = isEnglish ? `
    <p class="docs-nav-heading">English</p>
    <nav aria-label="English topics">
      <a href="${url('eng/index.html')}">Overview</a>
      <a href="${url('eng/index.html#topics')}">Topics</a>
      <a href="${url('eng/index.html#weather')}" class="docs-nav-child">Weather</a>
      <a href="${url('eng/index.html#daily-english')}">Daily English</a>
    </nav>
  ` : isFun ? `
    <p class="docs-nav-heading">Functional</p>
    <nav aria-label="Functional topics">
      <a href="${url('fun/index.html')}">Overview</a>
      <a href="#requirements">Requirements</a>
      <a href="#user-journeys">User journeys</a>
      <a href="#acceptance-criteria">Acceptance criteria</a>
      <a href="#process-documentation">Process documentation</a>
      <a href="#testing-scenarios">Testing scenarios</a>
    </nav>
  ` : `
    <p class="docs-nav-heading">Technical documentation</p>
    <nav aria-label="Documentation topics">
      <a href="${url('tec/index.html#overview')}">Overview</a>
      <a href="${url('tec/index.html#backend-topics')}">Backend</a>
      <a href="${url('tec/index.html#frontend-topics')}">Frontend</a>
      <a href="${url('tec/index.html#devops-topics')}">DevOps</a>
      <a href="${url('tec/git.html')}" class="docs-nav-child">Git overview</a>
      <a href="${url('tec/git-commands.html')}" class="docs-nav-child">Basic commands</a>
      <a href="${url('tec/git-branching.html')}" class="docs-nav-child">Branching strategy</a>
      <a href="${url('tec/git-challenges.html')}" class="docs-nav-child">Challenges</a>
      <a href="${url('tec/index.html#sites-topics')}">Sites for reference</a>
    </nav>
  `;

  const body = document.createElement('div');
  body.className = 'docs-body';
  const toc = document.createElement('aside');
  toc.className = 'docs-toc';
  toc.setAttribute('aria-label', 'On this page');
  toc.innerHTML = '<h2>On this page</h2><nav aria-label="Page sections"></nav>';
  main.before(shell);
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) body.append(breadcrumb);
  body.append(main);
  shell.append(sidebar, body, toc);

  const menuButton = header.querySelector('.docs-menu-button');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    document.body.classList.toggle('docs-menu-open', expanded);
  });

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      document.body.classList.remove('docs-menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  function refreshNavigation() {
    const current = new URL(window.location.href);
    const hashTarget = document.getElementById(current.hash.slice(1));
    const topicView = hashTarget?.closest('.topics-section');
    let activeHash = topicView ? `#${topicView.id}` : current.hash;
    if (isEnglish && hashTarget?.closest('#topics')) activeHash = '#weather';
    if (!activeHash) activeHash = '#overview';

    for (const link of sidebar.querySelectorAll('a')) {
      const target = new URL(link.href);
      const samePath = target.pathname === current.pathname
        || target.pathname === `${current.pathname}index.html`;
      const active = samePath && (target.hash ? target.hash === activeHash : !current.hash);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }

    const nav = toc.querySelector('nav');
    nav.replaceChildren();
    const headings = main.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `page-section-${index + 1}`;
      if (heading.closest('[hidden], .english-sidebar, .english-toc')) return;
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'docs-toc-child';
      if (current.hash === link.hash) link.setAttribute('aria-current', 'location');
      nav.append(link);
    });
    toc.hidden = nav.children.length === 0;
  }

  window.addEventListener('hashchange', refreshNavigation);
  document.addEventListener('docuhub:viewchange', refreshNavigation);
  document.addEventListener('DOMContentLoaded', refreshNavigation);
  refreshNavigation();
})();
