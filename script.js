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

    function viewFromHash() {
        const hash = window.location.hash.replace('#', '');
        return ['backend', 'devops', 'functional'].includes(hash.replace('-topics', ''))
            ? hash.replace('-topics', '')
            : 'overview';
    }

    viewLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const view = link.dataset.view;

            if (!view) {
                return;
            }

            event.preventDefault();
            showView(view);
            window.history.replaceState(null, '', view === 'overview' ? '#overview' : `#${view}-topics`);
            document.querySelector(view === 'overview' ? '#overview' : `#${view}-topics`).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    showView(viewFromHash());
    window.addEventListener('hashchange', () => {
        showView(viewFromHash());
    });

    document.querySelectorAll('[data-language]').forEach((code) => {
        const source = code.tagName === 'PRE'
            ? code.textContent
            : code.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        code.dataset.source = source;
        code.innerHTML = highlightCode(source, code.dataset.language);
    });

    document.querySelectorAll('[data-copy-target]').forEach((button) => {
        button.addEventListener('click', async () => {
            const code = document.getElementById(button.dataset.copyTarget);

            if (!code) {
                return;
            }

            const content = (code.dataset.source || code.textContent).trim().replace(/^\s+/gm, '');

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(content);
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = content;
                    textArea.setAttribute('readonly', '');
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    if (!document.execCommand('copy')) {
                        throw new Error('Copy command failed');
                    }
                    textArea.remove();
                }
                button.textContent = 'Copied';
                setTimeout(() => { button.textContent = 'Copy'; }, 1600);
            } catch {
                button.textContent = 'Copy failed';
                setTimeout(() => { button.textContent = 'Copy'; }, 1600);
            }
        });
    });

    function highlightCode(source, language) {
        let highlighted = escapeHtml(source.trim().replace(/^\s+/gm, ''));

        highlighted = highlighted.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|&quot;.*?&quot;)/g, '<span class="syntax-string">$1</span>');
        highlighted = highlighted.replace(/(\/\/.*|#.*|&lt;!--.*?--&gt;)/g, '<span class="syntax-comment">$1</span>');

        if (language === 'html') {
            highlighted = highlighted.replace(/(&lt;\/?[\w-]+|[\w-]+(?==))/g, '<span class="syntax-tag">$1</span>');
        } else if (language === 'javascript' || language === 'java') {
            highlighted = highlighted.replace(/\b(const|let|var|function|return|class|public|private|static|void|new|if|else|for|while|import|from|extends)\b/g, '<span class="syntax-keyword">$1</span>');
            highlighted = highlighted.replace(/\b(true|false|null|undefined|this)\b/g, '<span class="syntax-literal">$1</span>');
        } else if (language === 'bash') {
            highlighted = highlighted.replace(/^(git)\b/gm, '<span class="syntax-command">$1</span>');
        }

        return highlighted.replace(/\n/g, '<br />');
    }

    function escapeHtml(value) {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
});
