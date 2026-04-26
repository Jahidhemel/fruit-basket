/* =========================================================
   Fruit Burst — Frontend Interactions
   Author: Md. Jahidul Islam Hemel
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------
       1. Auto-update copyright year
    ----------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* -----------------------------------------------------
       2. Mobile nav toggle
    ----------------------------------------------------- */
    const menuBtn  = document.getElementById('mobileMenuBtn');
    const menu     = document.getElementById('mobileMenu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const isOpen = !menu.classList.contains('hidden');
            menuBtn.innerHTML = isOpen
                ? '<i class="fa fa-times"></i>'
                : '<i class="fa fa-bars"></i>';
        });
        // Close on link click
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
                menuBtn.innerHTML = '<i class="fa fa-bars"></i>';
            });
        });
    }


    /* -----------------------------------------------------
       3. Countdown timer — 7 days from page load
    ----------------------------------------------------- */
    const target = new Date();
    target.setDate(target.getDate() + 7);

    const els = {
        days:    document.querySelector('[data-unit="days"]'),
        hours:   document.querySelector('[data-unit="hours"]'),
        minutes: document.querySelector('[data-unit="minutes"]'),
        seconds: document.querySelector('[data-unit="seconds"]'),
    };

    function pad(n) { return n.toString().padStart(2, '0'); }

    function tick() {
        const now  = new Date();
        const diff = target - now;
        if (diff <= 0) {
            Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff / 3600000) % 24);
        const m = Math.floor((diff / 60000) % 60);
        const s = Math.floor((diff / 1000) % 60);
        if (els.days)    els.days.textContent    = pad(d);
        if (els.hours)   els.hours.textContent   = pad(h);
        if (els.minutes) els.minutes.textContent = pad(m);
        if (els.seconds) els.seconds.textContent = pad(s);
    }

    if (Object.values(els).some(Boolean)) {
        tick();
        setInterval(tick, 1000);
    }


    /* -----------------------------------------------------
       4. Toast helper
    ----------------------------------------------------- */
    function showToast(message) {
        let toast = document.querySelector('.fb-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = [
                'fb-toast fixed left-1/2 bottom-8 -translate-x-1/2 translate-y-24',
                'bg-slate-900 text-white text-sm font-medium',
                'px-5 py-3 rounded-full shadow-2xl z-[9999]',
                'opacity-0 transition-all duration-300 ease-out',
                'max-w-[90vw] text-center pointer-events-none',
            ].join(' ');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        // Show
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-24', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
            toast.classList.remove('translate-y-0', 'opacity-100');
        }, 3500);
    }


    /* -----------------------------------------------------
       5. Modal helper (lazily created)
    ----------------------------------------------------- */
    function showModal(title, body) {
        let backdrop = document.querySelector('.fb-modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = [
                'fb-modal-backdrop fixed inset-0 z-[9998]',
                'bg-slate-900/60 backdrop-blur-sm',
                'flex items-center justify-center p-5',
                'opacity-0 invisible transition-all duration-200',
            ].join(' ');
            backdrop.innerHTML = `
                <div class="fb-modal bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl scale-95 transition-transform duration-200">
                    <button class="fb-modal-close absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-700 w-9 h-9 rounded-full hover:bg-slate-100 transition" aria-label="Close">&times;</button>
                    <h3 class="fb-modal-title text-xl font-bold text-slate-900 mb-3"></h3>
                    <p class="fb-modal-body text-slate-600 leading-relaxed mb-6"></p>
                    <a class="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3 rounded-full transition" href="mailto:jahidhemel@gmail.com">Email Hemel</a>
                </div>
            `;
            document.body.appendChild(backdrop);

            const close = () => {
                backdrop.classList.add('opacity-0', 'invisible');
                backdrop.classList.remove('opacity-100', 'visible');
                backdrop.querySelector('.fb-modal').classList.add('scale-95');
                backdrop.querySelector('.fb-modal').classList.remove('scale-100');
            };
            backdrop.addEventListener('click', e => {
                if (e.target === backdrop || e.target.classList.contains('fb-modal-close')) close();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') close();
            });
        }
        backdrop.querySelector('.fb-modal-title').textContent = title;
        backdrop.querySelector('.fb-modal-body').textContent  = body;
        backdrop.classList.remove('opacity-0', 'invisible');
        backdrop.classList.add('opacity-100', 'visible');
        backdrop.querySelector('.fb-modal').classList.remove('scale-95');
        backdrop.querySelector('.fb-modal').classList.add('scale-100');
    }


    /* -----------------------------------------------------
       6. Search form
    ----------------------------------------------------- */
    const searchForm  = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', e => {
            e.preventDefault();
            const q = searchInput.value.trim();
            if (!q) {
                showToast('Type a fruit name to search.');
                return;
            }
            showToast(`🔍 Searching for "${q}"…`);
            searchInput.value = '';
        });
    }


    /* -----------------------------------------------------
       7. Newsletter form
    ----------------------------------------------------- */
    const newsletterForm  = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                showToast('That email looks off — double-check it.');
                return;
            }
            showToast(`Thanks! Watch your inbox for fresh deals.`);
            newsletterForm.reset();
        });
    }


    /* -----------------------------------------------------
       8. Demo CTAs — Add to cart, Shop all, etc.
    ----------------------------------------------------- */
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            showModal(
                'Just a demo!',
                "Hey! This is a demo from my portfolio, so the cart and checkout aren't wired up. Drop me an email if you'd like to chat."
            );
        });
    });

    document.querySelectorAll('.demo-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showModal(
                'Just a demo!',
                "These social profiles are for the fictional team — they don't link anywhere. Find my real socials in the footer."
            );
        });
    });

});
