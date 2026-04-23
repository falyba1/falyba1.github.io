/* =========================================================
   MOUHAMADOU FALY BA — Portfolio Interactions
   Independent-tabs layout (panels) + FR/EN + dark/light theme
   ========================================================= */
(function () {
    'use strict';

    const html = document.documentElement;
    const nav = document.getElementById('nav');
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const langToggle = document.getElementById('lang-toggle');
    const langLabel = document.getElementById('lang-label');
    const cvDownload = document.getElementById('cv-download');
    const toTop = document.getElementById('to-top');

    const panels = Array.from(document.querySelectorAll('.panel'));
    const panelLinks = Array.from(document.querySelectorAll('[data-panel]'));

    // Reveal observer declared early (used by activatePanel below)
    let revealObserver = null;
    function ensureObserver() {
        if (revealObserver || !('IntersectionObserver' in window)) return;
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    }
    function observeReveals(root) {
        ensureObserver();
        const els = (root || document).querySelectorAll('.reveal:not(.is-in)');
        if (!revealObserver) {
            els.forEach(el => el.classList.add('is-in'));
            return;
        }
        els.forEach(el => revealObserver.observe(el));
    }

    /* =========================================================
       THEME (light / dark)
       ========================================================= */
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        try { localStorage.setItem('mfb-theme', theme); } catch (e) {}
        if (themeIcon) {
            themeIcon.className = theme === 'dark'
                ? 'fa-solid fa-sun'
                : 'fa-solid fa-moon';
        }
        // Update meta theme-color to match
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#3b63e6');
    }

    let savedTheme = null;
    try { savedTheme = localStorage.getItem('mfb-theme'); } catch (e) {}
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') || 'light';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /* =========================================================
       LANGUAGE (FR / EN)
       ========================================================= */
    function setLang(lang) {
        html.setAttribute('lang', lang);
        try { localStorage.setItem('mfb-lang', lang); } catch (e) {}
        if (langLabel) langLabel.textContent = lang.toUpperCase();
        if (cvDownload) {
            cvDownload.href = lang === 'en' ? 'cv/MFB_CV_EN.docx' : 'cv/MFB_CV_FR.docx';
        }
        document.title = lang === 'en'
            ? 'Mouhamadou Faly Ba, PharmD, MPH, PhD — Public Health Researcher'
            : 'Mouhamadou Faly Ba, PharmD, MPH, PhD — Chercheur en Santé Publique';
    }

    let savedLang = 'fr';
    try { savedLang = localStorage.getItem('mfb-lang') || 'fr'; } catch (e) {}
    setLang(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = html.getAttribute('lang') || 'fr';
            setLang(current === 'fr' ? 'en' : 'fr');
        });
    }

    /* =========================================================
       TABBED NAVIGATION — independent panels
       ========================================================= */
    function closeMobileMenu() {
        if (navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        }
    }

    function activatePanel(panelKey) {
        if (!panelKey) panelKey = 'home';
        const target = document.getElementById('panel-' + panelKey);
        if (!target) return;

        // Toggle panels
        panels.forEach(p => p.classList.toggle('active', p === target));

        // Highlight nav link
        document.querySelectorAll('.nav-link').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-panel') === panelKey);
        });

        // Update URL hash (without jumping)
        if (history.replaceState) {
            history.replaceState(null, '', '#' + panelKey);
        }

        // Scroll to top of content (below sticky nav)
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

        // Re-trigger reveal animations for the freshly-shown panel
        target.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('is-in');
        });
        // observe new ones
        observeReveals(target);

        closeMobileMenu();
    }

    // Bind any element with data-panel
    panelLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const key = link.getAttribute('data-panel');
            activatePanel(key);
        });
    });

    // Respect initial hash (e.g. falyba1.github.io/#projects)
    const initialKey = (window.location.hash || '#home').replace('#', '');
    activatePanel(initialKey);

    // React to hash changes (e.g. back/forward)
    window.addEventListener('hashchange', () => {
        const key = (window.location.hash || '#home').replace('#', '');
        activatePanel(key);
    });

    /* =========================================================
       CONTACT TEASER — injected at the bottom of each panel
       ========================================================= */
    const teaserTemplate = `
        <div class="container">
            <div class="contact-teaser-text">
                <h3>
                    <span class="lang-fr">Une collaboration en vue ?</span>
                    <span class="lang-en">A collaboration in mind?</span>
                </h3>
                <p>
                    <span class="lang-fr">Écrivez-moi — je reviens vers vous rapidement pour les projets de recherche, consultations et interventions.</span>
                    <span class="lang-en">Get in touch — I reply quickly for research projects, consultations and talks.</span>
                </p>
            </div>
            <div class="contact-teaser-actions">
                <a class="teaser-link" href="mailto:falyba1@gmail.com">
                    <i class="fa-solid fa-envelope"></i>
                    <span>falyba1@gmail.com</span>
                </a>
                <a class="teaser-link" href="https://linkedin.com/in/mouhamadou-faly-ba-8767581b1/" target="_blank" rel="noopener">
                    <i class="fa-brands fa-linkedin-in"></i>
                    <span>LinkedIn</span>
                </a>
                <a class="teaser-link" href="https://orcid.org/0000-0002-1898-738X" target="_blank" rel="noopener">
                    <i class="fa-brands fa-orcid"></i>
                    <span>ORCID</span>
                </a>
                <a class="teaser-link teaser-cta" href="#contact" data-panel="contact">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span class="lang-fr">Me contacter</span>
                    <span class="lang-en">Contact me</span>
                </a>
            </div>
        </div>
    `;
    document.querySelectorAll('[data-contact-teaser]').forEach(slot => {
        slot.classList.add('contact-teaser');
        slot.innerHTML = teaserTemplate;
    });
    // Bind the freshly-injected teaser CTA to the tab-switcher too
    document.querySelectorAll('.contact-teaser [data-panel]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            activatePanel(link.getAttribute('data-panel'));
        });
    });

    /* =========================================================
       MOBILE MENU
       ========================================================= */
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.innerHTML = open
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    /* =========================================================
       SCROLL EFFECTS — nav shadow, back-to-top
       ========================================================= */
    function onScroll() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
        if (toTop) toTop.classList.toggle('visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================================
       REVEAL ON SCROLL (initial observation — observer defined above)
       ========================================================= */
    observeReveals(document);

    /* =========================================================
       ANIMATED COUNTERS (hero stats)
       ========================================================= */
    const counters = document.querySelectorAll('.stat-value[data-count]');
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1600;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + (progress >= 1 ? '+' : '');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + '+';
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && counters.length) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCounter(e.target);
                    co.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => co.observe(c));
    }

    /* =========================================================
       PROJECT FILTERS
       ========================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projCards = document.querySelectorAll('.proj-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            projCards.forEach(card => {
                const y = card.getAttribute('data-year');
                const show = f === 'all' || y === f;
                card.style.display = show ? '' : 'none';
            });
        });
    });

    /* =========================================================
       PUBLICATIONS SUB-TABS (First author / Co-author / Book)
       ========================================================= */
    const pubTabs = document.querySelectorAll('.pub-tab-btn');
    const pubPanels = document.querySelectorAll('.pub-panel');
    pubTabs.forEach(t => {
        t.addEventListener('click', () => {
            const target = t.getAttribute('data-pub');
            pubTabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            pubPanels.forEach(p => {
                p.classList.toggle('active', p.id === 'pub-' + target);
            });
        });
    });

    /* =========================================================
       CONTACT FORM — AJAX submit via FormSubmit (keeps user on page)
       ========================================================= */
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            formSuccess && formSuccess.classList.remove('show');
            formError && formError.classList.remove('show');
            const submitBtn = form.querySelector('.form-submit');
            const originalHTML = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>…</span>';
            }

            const data = new FormData(form);
            // FormSubmit AJAX endpoint
            fetch('https://formsubmit.co/ajax/falyba1@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            })
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(() => {
                form.reset();
                formSuccess && formSuccess.classList.add('show');
            })
            .catch(() => {
                formError && formError.classList.add('show');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            });
        });
    }

})();
