(() => {
  const root = new URL('.', document.currentScript.src);
  const url = (path) => new URL(path, root).href;
  const isEnglish = window.location.pathname.endsWith('/eng/index.html')
    || window.location.pathname.endsWith('/eng/');
  const isFun = window.location.pathname.endsWith('/fun/index.html')
    || window.location.pathname.endsWith('/fun/');
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const headerInner = header.querySelector('.header-inner');

  headerInner.innerHTML = `
    <a href="${url('index.html')}" class="brand">
      <span class="docs-brand-mark" aria-hidden="true">D</span>
      Docuhub <span class="docs-brand-label">Documentation</span>
    </a>
    <nav class="main-nav" aria-label="Primary navigation">
      <a href="${url('index.html#overview')}"${!isEnglish && !isFun ? ' aria-current="page"' : ''}>Documentation</a>
      <a href="${url('eng/index.html')}"${isEnglish ? ' aria-current="page"' : ''}>English</a>
      <a href="${url('fun/index.html')}"${isFun ? ' aria-current="page"' : ''}>Fun</a>
      ${isEnglish ? '<a href="#topics">Topics</a><a href="#daily-english">Daily English</a>' : ''}
    </nav>
    <button class="docs-menu-button" type="button" aria-expanded="false" aria-controls="docs-sidebar">Browse docs</button>
  `;

  const shell = document.createElement('div');
  shell.className = 'docs-shell';
  const sidebar = document.createElement('aside');
  sidebar.id = 'docs-sidebar';
  sidebar.className = 'docs-sidebar';
  sidebar.innerHTML = `
    <p class="docs-nav-heading">Documentation</p>
    <nav aria-label="Documentation topics">
      <a href="${url('index.html#overview')}">Overview</a>
      <a href="${url('index.html#backend-topics')}">Backend</a>
      <a href="${url('index.html#frontend-topics')}">Frontend</a>
      <a href="${url('index.html#devops-topics')}">DevOps</a>
      <a href="${url('git.html')}" class="docs-nav-child">Git overview</a>
      <a href="${url('git-commands.html')}" class="docs-nav-child">Basic commands</a>
      <a href="${url('git-branching.html')}" class="docs-nav-child">Branching strategy</a>
      <a href="${url('git-challenges.html')}" class="docs-nav-child">Challenges</a>
      <a href="${url('index.html#functional-topics')}">Functional</a>
      <a href="${url('index.html#sites-topics')}">Sites for reference</a>
    </nav>
    <p class="docs-nav-heading">Learning</p>
    <nav aria-label="Learning topics">
      <a href="${url('eng/index.html')}">English</a>
      <a href="${url('eng/index.html#weather')}" class="docs-nav-child">Weather</a>
      <a href="${url('eng/index.html#daily-english')}" class="docs-nav-child">Daily English</a>
      <a href="${url('fun/index.html')}">Fun</a>
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
