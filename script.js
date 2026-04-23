/* =========================================================
   MOUHAMADOU FALY BA — Portfolio Interactions
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

    /* ---------- Theme (dark / light) ---------- */
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('mfb-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark'
                ? 'fa-solid fa-sun'
                : 'fa-solid fa-moon';
        }
    }

    const savedTheme = localStorage.getItem('mfb-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
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

    /* ---------- Language (FR / EN) ---------- */
    function setLang(lang) {
        html.setAttribute('lang', lang);
        localStorage.setItem('mfb-lang', lang);
        if (langLabel) langLabel.textContent = lang.toUpperCase();
        if (cvDownload) {
            cvDownload.href = lang === 'en' ? 'cv/MFB_CV_EN.docx' : 'cv/MFB_CV_FR.docx';
        }
        // Update page title
        document.title = lang === 'en'
            ? 'Mouhamadou Faly Ba, PharmD, MPH, PhD — Public Health Researcher'
            : 'Mouhamadou Faly Ba, PharmD, MPH, PhD — Chercheur en Santé Publique';
    }

    const savedLang = localStorage.getItem('mfb-lang') || 'fr';
    setLang(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = html.getAttribute('lang') || 'fr';
            setLang(current === 'fr' ? 'en' : 'fr');
        });
    }

    /* ---------- Mobile menu ---------- */
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.innerHTML = open
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* ---------- Scroll effects: nav shadow, scroll spy, back to top ---------- */
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navAnchors = Array.from(document.querySelectorAll('.nav-link'));

    function onScroll() {
        // Nav shadow
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);

        // Back-to-top
        if (toTop) toTop.classList.toggle('visible', window.scrollY > 500);

        // Scroll spy
        const y = window.scrollY + 140;
        let current = sections[0]?.id;
        for (const s of sections) {
            if (s.offsetTop <= y) current = s.id;
        }
        navAnchors.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            a.classList.toggle('active', href === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-in'));
    }

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('.stat-value[data-count]');
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + (progress >= 1 ? '+' : '') + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + '+' + suffix;
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

    /* ---------- Projects filter ---------- */
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

    /* ---------- Publications tabs ---------- */
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

})();
