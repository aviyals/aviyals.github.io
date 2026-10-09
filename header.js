class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="brand">Docuhub</a>
          <nav class="main-nav" aria-label="Primary navigation">
            <a href="index.html#overview">Overview</a>
            <a href="index.html#backend-topics">Backend</a>
            <a href="index.html#frontend-topics">Frontend</a>
            <a href="index.html#devops-topics">DevOps</a>
            <a href="index.html#sites-topics">Sites</a>
            <a href="index.html#functional-topics">Functional</a>
          </nav>
        </div>
      </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);
