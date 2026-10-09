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
        return ['backend', 'frontend', 'javascript', 'devops', 'sites', 'functional'].includes(hash.replace('-topics', ''))
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
            const decodedSource = decodeCodeEntities(source);
            code.dataset.source = decodedSource;
            code.innerHTML = highlightCode(decodedSource, code.dataset.language);
    });

    document.querySelectorAll('[data-copy-target]').forEach((button) => {
        button.addEventListener('click', async () => {
            const code = document.getElementById(button.dataset.copyTarget);

            if (!code) {
                return;
            }

            const source = (code.dataset.source || code.textContent).replace(/\r\n/g, '\n').trim();
            const lines = source.split('\n');
            const indentation = Math.min(...lines
                .filter((line) => line.trim())
                .map((line) => line.match(/^[\t ]*/)[0].length));
            const content = Number.isFinite(indentation)
                ? lines.map((line) => line.slice(indentation)).join('\n')
                : source;

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
        const normalizedSource = source.replace(/\r\n/g, '\n').trim();
        const lines = normalizedSource.split('\n');
        const indentation = Math.min(...lines
            .filter((line) => line.trim())
            .map((line) => line.match(/^[\t ]*/)[0].length));
        const formattedSource = Number.isFinite(indentation)
            ? lines.map((line) => line.slice(indentation)).join('\n')
            : normalizedSource;
        const escaped = escapeHtml(formattedSource);
        let highlighted = escaped;

        if (language === 'html') {
            highlighted = escaped.replace(/(&lt;!--.*?--&gt;)|(&lt;\/?[A-Za-z][\w-]*|&gt;)|([\w-]+)(?==)|(&quot;.*?&quot;|&#39;.*?&#39;)/g, (token, comment, tag, attribute, string) => {
                if (comment) return `<span class="syntax-comment">${comment}</span>`;
                if (tag) return `<span class="syntax-tag">${tag}</span>`;
                if (attribute) return `<span class="syntax-attribute">${attribute}</span>`;
                if (string) return `<span class="syntax-string">${string}</span>`;
                return token;
            });
        } else if (language === 'javascript' || language === 'java') {
            highlighted = escaped.replace(/(\/\/[^\n]*)|(&quot;.*?&quot;|&#39;.*?&#39;)|(&lt;\/?[A-Za-z][\w-]*|&gt;)|\b(const|let|var|function|return|class|public|private|static|void|new|if|else|for|while|import|from|extends)\b|\b(true|false|null|undefined|this)\b/g, (token, comment, string, tag, keyword, literal) => {
                if (comment) return `<span class="syntax-comment">${comment}</span>`;
                if (string) return `<span class="syntax-string">${string}</span>`;
                if (tag) return `<span class="syntax-tag">${tag}</span>`;
                if (keyword) return `<span class="syntax-keyword">${keyword}</span>`;
                if (literal) return `<span class="syntax-literal">${literal}</span>`;
                return token;
            });
        } else if (language === 'bash') {
            highlighted = escaped.replace(/^(git)\b/gm, '<span class="syntax-command">$1</span>');
        }

        return highlighted;
    }

    function escapeHtml(value) {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

        function decodeCodeEntities(value) {
            return value
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&');
        }

    
});
