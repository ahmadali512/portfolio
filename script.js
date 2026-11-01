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