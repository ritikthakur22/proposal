// Single-page routing + shared interactions

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupSparkles();
    startRouter();
});

function startRouter() {
    const routes = {
        home: { tmpl: 'tmpl-home', title: 'For You, My Love | Home', bodyClass: 'page-home has-hearts' },
        story: { tmpl: 'tmpl-story', title: 'Our Story', bodyClass: 'page-story' },
        letter: { tmpl: 'tmpl-letter', title: 'Love Letter', bodyClass: 'page-letter' },
        songs: { tmpl: 'tmpl-songs', title: 'Songs That Remind Me of You', bodyClass: 'page-songs' },
        proposal: { tmpl: 'tmpl-proposal', title: 'The Proposal', bodyClass: 'page-proposal has-hearts' }
    };

    const renderRoute = () => {
        const raw = window.location.hash.replace(/^#\//, '').trim();
        const key = routes[raw] ? raw : 'home';
        const conf = routes[key];
        const app = document.getElementById('app');
        const tpl = document.getElementById(conf.tmpl);
        if (app && tpl) {
            app.innerHTML = tpl.innerHTML;
        }
        document.title = conf.title;
        document.body.className = conf.bodyClass;
        // Reveal body after we set class to avoid FOUC
        document.body.style.opacity = '';
        initPage();
    };

    window.addEventListener('hashchange', renderRoute);
    // Default to home if no hash present
    if (!window.location.hash) {
        window.location.replace('#/home');
    }
    renderRoute();
}

function initPage() {
    handleCreatorOverlay();
    setActiveNav();
    setupRevealAnimations();
    setupFloatingHearts();
    setupTypingEffect();
    setupReadMore();
    setupLightbox();
    setupProposalPage();
    setupSongAudio();
    setupAnchorScroll();
    setupSoloSong();
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function setActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;
    const hash = window.location.hash || '#/home';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href').slice(1);
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupRevealAnimations() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

let heartsInterval = null;

function setupFloatingHearts() {
    const hasHearts = document.body.classList.contains('has-hearts');
    let container = document.querySelector('[data-hearts-container]');

    if (!hasHearts) {
        if (heartsInterval) {
            clearInterval(heartsInterval);
            heartsInterval = null;
        }
        if (container) container.remove();
        return;
    }

    if (!container) {
        container = document.createElement('div');
        container.setAttribute('data-hearts-container', 'true');
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.overflow = 'hidden';
        container.style.zIndex = '0';
        document.body.appendChild(container);
    }

    if (heartsInterval) return; // Prevent duplicate timers on page navigation

    heartsInterval = setInterval(() => {
        if (!document.body.classList.contains('has-hearts')) {
            clearInterval(heartsInterval);
            heartsInterval = null;
            return;
        }
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${16 + Math.random() * 12}px`;
        heart.style.animationDuration = `${5 + Math.random() * 4}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 9000);
    }, 1200);
}

function setupSparkles() {
    if (document.querySelector('.sparkle-field')) return;
    const field = document.createElement('div');
    field.className = 'sparkle-field';
    const count = 28;
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('span');
        repositionSparkle(spark);
        spark.style.animationDelay = `${Math.random() * 6}s`;
        spark.style.animationDuration = `${6 + Math.random() * 4}s`;
        spark.addEventListener('animationiteration', () => repositionSparkle(spark));
        field.appendChild(spark);
    }
    document.body.appendChild(field);
}

function repositionSparkle(el) {
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
}

function setupTypingEffect() {
    const typingEl = document.querySelector('[data-typing]');
    if (!typingEl) return;

    const text = typingEl.dataset.typing || typingEl.textContent.trim();
    typingEl.textContent = '';
    let index = 0;

    const type = () => {
        if (index <= text.length) {
            typingEl.textContent = text.slice(0, index);
            index++;
            setTimeout(type, 38);
        }
    };

    type();
}

function setupReadMore() {
    const expandable = document.querySelector('.expandable');
    const toggleBtn = document.querySelector('.read-more');
    if (!expandable || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = expandable.classList.toggle('open');
        toggleBtn.textContent = isOpen ? 'Show Less' : 'Read More';
    });
}

function setupLightbox() {
    const images = Array.from(document.querySelectorAll('[data-gallery]'));
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img alt="memory" />
            <button class="prev" aria-label="Previous">‹</button>
            <button class="next" aria-label="Next">›</button>
            <button class="close" aria-label="Close">×</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('img');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    const closeBtn = lightbox.querySelector('.close');
    let current = 0;

    const openLightbox = index => {
        current = index;
        imgEl.src = images[current].src;
        lightbox.classList.add('active');
    };

    const showNext = dir => {
        current = (current + dir + images.length) % images.length;
        imgEl.src = images[current].src;
    };

    images.forEach((img, idx) => {
        img.dataset.index = idx;
        img.addEventListener('click', () => openLightbox(idx));
    });

    prevBtn.addEventListener('click', () => showNext(-1));
    nextBtn.addEventListener('click', () => showNext(1));
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowRight') showNext(1);
        if (e.key === 'ArrowLeft') showNext(-1);
    });
}

function setupSongAudio() {
    const audioEls = Array.from(document.querySelectorAll('.song-card audio, .solo-song audio'));
    if (!audioEls.length) return;

    audioEls.forEach(audio => {
        audio.addEventListener('play', () => {
            audioEls.forEach(other => {
                if (other !== audio) other.pause();
            });
        });
    });
}

function setupSoloSong() {
    const btn = document.getElementById('playDieSong');
    const audio = document.getElementById('dieSongAudio');
    if (!btn || !audio) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.currentTime = 0;
            audio.play();
            btn.textContent = 'Pause Die With A Smile';
        } else {
            audio.pause();
            btn.textContent = 'Play Die With A Smile';
        }
    });

    audio.addEventListener('ended', () => {
        btn.textContent = 'Play Die With A Smile';
    });
}

function handleCreatorOverlay() {
    const overlay = document.getElementById('creator-overlay');
    const btn = document.getElementById('creator-continue');
    if (!overlay || !btn) return;

    const dismiss = () => {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        setTimeout(() => overlay.remove(), 400);
    };

    if (localStorage.getItem('creatorSeen')) {
        dismiss();
        return;
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('creatorSeen', 'true');
        dismiss();
    });
}

function setupProposalPage() {
    const yesBtn = document.getElementById('yesButton');
    const thinkBtn = document.getElementById('thinkButton');
    const messageBox = document.querySelector('.message-box');

    if (yesBtn && messageBox) {
        const handleYes = (e) => {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            // Guard against duplicate firing on mobile (touch + click)
            if (yesBtn.dataset.firing === 'true') return;
            yesBtn.dataset.firing = 'true';

            messageBox.textContent = 'You just made me the happiest person alive.';
            launchCelebration();
            playCelebrationSong();
            sendNotification('yes').finally(() => {
                // Release the guard shortly after send
                setTimeout(() => { yesBtn.dataset.firing = 'false'; }, 200);
            });
        };
        yesBtn.addEventListener('click', handleYes, { passive: false });
        yesBtn.addEventListener('pointerup', handleYes, { passive: false });
        yesBtn.addEventListener('touchend', handleYes, { passive: false });
    }

    if (thinkBtn && messageBox) {
        const handleThink = (e) => {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            if (thinkBtn.dataset.firing === 'true') return;
            thinkBtn.dataset.firing = 'true';

            messageBox.textContent = 'No matter what, you will always be special to me.';
            sendNotification('think').finally(() => {
                setTimeout(() => { thinkBtn.dataset.firing = 'false'; }, 200);
            });
        };
        thinkBtn.addEventListener('click', handleThink, { passive: false });
        thinkBtn.addEventListener('pointerup', handleThink, { passive: false });
        thinkBtn.addEventListener('touchend', handleThink, { passive: false });

        // Show the gentle message on hover (without clicking)
        let hoverTimer;
        const triggerDodge = () => {
            messageBox.textContent = 'No matter what, you will always be special to me.';
            relocateThinkButton(thinkBtn);
        };

        thinkBtn.addEventListener('mouseenter', () => {
            messageBox.textContent = 'No matter what, you will always be special to me.';
            const delay = 100 + Math.random() * 300;
            hoverTimer = setTimeout(() => relocateThinkButton(thinkBtn), delay);
        });
        thinkBtn.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });
        // On mobile touch, playfully jump away before tap can register
        thinkBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            triggerDodge();
        }, { passive: false });
    }

}

function relocateThinkButton(btn) {
    const wrap = document.querySelector('.proposal-wrap');
    if (!wrap || !btn) return;
    // Ensure the container is positioned for absolute children
    if (getComputedStyle(wrap).position === 'static') {
        wrap.style.position = 'relative';
    }
    // Move button into the wrap to position freely
    if (btn.parentElement !== wrap) {
        wrap.appendChild(btn);
    }
    btn.style.position = 'absolute';
    btn.style.zIndex = '5';
    const padding = 8;
    const maxLeft = Math.max(0, wrap.clientWidth - btn.offsetWidth - padding);
    const maxTop = Math.max(0, wrap.clientHeight - btn.offsetHeight - padding);
    const left = padding + Math.random() * maxLeft;
    const top = padding + Math.random() * maxTop;
    btn.style.left = `${left}px`;
    btn.style.top = `${top}px`;
}

function launchCelebration() {
    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.inset = '0';
    burst.style.pointerEvents = 'none';
    burst.style.overflow = 'hidden';
    burst.style.zIndex = '30';
    document.body.appendChild(burst);

    for (let i = 0; i < 28; i++) {
        setTimeout(() => createConfettiHeart(burst), i * 120);
    }

    setTimeout(() => burst.remove(), 4500);
}

function createConfettiHeart(container) {
    const heart = document.createElement('span');
    heart.textContent = ['❤', '♡', '❥'][Math.floor(Math.random() * 3)];
    heart.style.position = 'absolute';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 20}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.color = ['#e26a8b', '#f59ab2', '#c94f73'][Math.floor(Math.random() * 3)];
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'floatUp 3.2s ease forwards';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 3500);
}

// Play a celebratory song on Yes click
let celebrationAudio;
function playCelebrationSong() {
    try {
        // Pause any existing audio elements to avoid overlap
        document.querySelectorAll('audio').forEach(a => {
            try { a.pause(); } catch (e) {}
        });
        if (!celebrationAudio) {
            celebrationAudio = new Audio('audio/die-with-a-smile.mp3');
            celebrationAudio.preload = 'auto';
            celebrationAudio.volume = 1.0;
        }
        celebrationAudio.currentTime = 0;
        const playPromise = celebrationAudio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {
                // If autoplay is blocked, show a subtle cue
                console.warn('Audio playback was blocked; user interaction required.');
            });
        }
    } catch (err) {
        console.error('Failed to play celebration song:', err);
    }
}

// ==========================================
// Notification Configuration (GitHub Pages Safe)
// ==========================================
// Note: To keep your private Discord Webhook secure when this repo is public,
// do not paste your raw Discord Webhook URL here (GitHub & Discord will revoke it).
// Instead, use a free proxy (Cloudflare Worker or Formspree) if you want notifications.
// If left empty, the site functions completely locally with no remote network calls.
const NOTIFICATION_ENDPOINT = '';

async function sendNotification(action) {
    if (!NOTIFICATION_ENDPOINT) {
        console.log(`[Proposal Response] Selected: ${action} at ${new Date().toISOString()}`);
        return;
    }

    const payload = {
        action: action === 'yes' ? 'Yes ❤️' : 'I need to think 😊',
        route: window.location.hash || '#/proposal',
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(NOTIFICATION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'cors',
            keepalive: true
        });
        console.log('Notification delivered successfully');
    } catch (err) {
        console.warn('Could not deliver notification:', err);
    }
}
