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