// Scroll progress bar
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
}, { passive: true });

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav link
const links = [...document.querySelectorAll('#nav a')];
const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id], footer[id]').forEach(s => spy.observe(s));

// Typing effect
const roles = ['Full Stack Developer', 'Problem Solver', 'Software Engineer'];
const el = document.getElementById('typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
} else {
    let r = 0, c = 0, del = false;
    (function tick() {
        const word = roles[r];
        el.textContent = word.slice(0, c);
        if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
        if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
        c += del ? -1 : 1;
        setTimeout(tick, del ? 40 : 80);
    })();
}

// 3D tilt on project cards (fine pointers only)
if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project').forEach(card => {
        card.addEventListener('mousemove', e => {
            const b = card.getBoundingClientRect();
            const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });
}

// Dark / light theme toggle (remembers choice)
const root = document.documentElement, themeBtn = document.getElementById('theme');
function paintTheme() {
    const dark = root.dataset.theme === 'dark';
    themeBtn.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i>`;
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    paintTheme();
});
paintTheme();

// Nav shadow + back-to-top
const nav = document.querySelector('.nav'), topBtn = document.getElementById('top-btn');
addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    topBtn.classList.toggle('show', scrollY > 600);
}, { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0 }));

// Animated counters (values come from the page itself)
const counts = { projects: document.querySelectorAll('.project').length, skills: document.querySelectorAll('.skill-group li').length };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const counter = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const b = e.target, key = b.dataset.count, end = counts[key] ?? +key;
    counter.unobserve(b);
    if (reduce) { b.textContent = end; return; }
    const t0 = performance.now();
    (function step(t) {
        const p = Math.min((t - t0) / 1000, 1);
        b.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
    })(t0);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(b => counter.observe(b));

// Copy email
const copy = document.getElementById('copy');
copy.addEventListener('click', async () => {
    const email = document.querySelector('a[href^="mailto:"]').getAttribute('href').slice(7);
    try { await navigator.clipboard.writeText(email); copy.textContent = 'Copied'; }
    catch (e) { copy.textContent = email; }
    setTimeout(() => copy.textContent = 'Copy email', 2000);
});

// Hide broken project images instead of showing a broken icon
document.querySelectorAll('.thumb img').forEach(img => img.addEventListener('error', () => {
    img.style.display = 'none'; img.parentElement.style.background = 'linear-gradient(135deg, var(--primary), var(--cyan))';
}));