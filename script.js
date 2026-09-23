
document.addEventListener('DOMContentLoaded', () => {
    const viewLinks = document.querySelectorAll('[data-view]');
    const landingSections = document.querySelectorAll('main > section:not(.topics-section)');
    const topicSections = document.querySelectorAll('.topics-section');

    function showView(view) {
        const isOverview = view === 'overview';

        landingSections.forEach((section) => {
            section.hidden = !isOverview;
        });

        topicSections.forEach((section) => {
            section.hidden = section.id !== `${view}-topics`;
        });

        viewLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.view === view);
        });
    }

    viewLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const view = link.dataset.view;

            if (!view) {
                return;
            }

            event.preventDefault();
            showView(view);
            document.querySelector(view === 'overview' ? '#overview' : `#${view}-topics`).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});
