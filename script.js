// Single-page routing + shared interactions

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupSparkles();
    setupGlobalAudio();
    autoPlaySong();
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
    handlePeekNavigation();
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

function setupGlobalAudio() {
    const floatingBtn = document.getElementById('globalMusicBtn');
    if (!floatingBtn) return;
    floatingBtn.addEventListener('click', toggleGlobalAudio);
}

function toggleGlobalAudio() {
    const audio = document.getElementById('globalAudio');
    if (!audio) return;

    if (audio.paused) {
        audio.play().then(() => {
            syncAudioState(true);
        }).catch(err => {
            console.warn('Playback blocked by browser policy:', err);
        });
    } else {
        audio.pause();
        syncAudioState(false);
    }
}

function syncAudioState(isPlaying) {
    const floatingBtn = document.getElementById('globalMusicBtn');
    const pageBtn = document.getElementById('playDieSong');
    if (floatingBtn) {
        floatingBtn.classList.toggle('is-playing', isPlaying);
        const label = floatingBtn.querySelector('.music-label');
        if (label) label.textContent = isPlaying ? 'Playing' : 'Play Music';
    }
    if (pageBtn) {
        pageBtn.textContent = isPlaying ? 'Pause Die With A Smile' : 'Play Die With A Smile';
    }
}

function setupSoloSong() {
    const pageBtn = document.getElementById('playDieSong');
    const audio = document.getElementById('globalAudio');
    if (!pageBtn || !audio) return;

    // Sync button text on load
    pageBtn.textContent = audio.paused ? 'Play Die With A Smile' : 'Pause Die With A Smile';

    pageBtn.addEventListener('click', () => {
        toggleGlobalAudio();
    });
}

function playCelebrationSong() {
    const audio = document.getElementById('globalAudio');
    if (audio) {
        audio.currentTime = 0;
        audio.play().then(() => syncAudioState(true)).catch(() => {});
    }
}

function handlePeekNavigation() {
    const peekBtn = document.getElementById('peekFinaleBtn');
    if (peekBtn) {
        peekBtn.addEventListener('click', () => {
            sessionStorage.setItem('peekedFinale', 'true');
        });
    }
    const storyBtn = document.getElementById('beginStoryBtn');
    if (storyBtn) {
        storyBtn.addEventListener('click', () => {
            sessionStorage.removeItem('peekedFinale');
        });
    }
}

function autoPlaySong() {
    const audio = document.getElementById('globalAudio');
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            syncAudioState(true);
        }).catch(() => {
            // Unmute/play on very first user interaction
            const unlock = () => {
                if (audio.paused) {
                    audio.play().then(() => syncAudioState(true)).catch(() => {});
                }
                ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                    window.removeEventListener(evt, unlock, true);
                });
            };
            ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                window.addEventListener(evt, unlock, { once: true, capture: true });
            });
        });
    }
}

function setupProposalPage() {
    const yesBtn = document.getElementById('yesButton');
    const thinkBtn = document.getElementById('thinkButton');
    const messageBox = document.querySelector('.message-box');
    const wrap = document.querySelector('.proposal-wrap');

    if (!yesBtn || !thinkBtn || !messageBox) return;

    // Check if user came from "Peek at the finale"
    const backLink = document.getElementById('proposalBackLink');
    if (backLink) {
        if (sessionStorage.getItem('peekedFinale') === 'true') {
            backLink.setAttribute('href', '#/home');
            backLink.innerHTML = '&larr; Back to Home';
            backLink.addEventListener('click', () => {
                sessionStorage.removeItem('peekedFinale');
            });
        } else {
            backLink.setAttribute('href', '#/songs');
            backLink.innerHTML = '&larr; Back to Songs';
        }
    }

    let dodgeCount = 0;
    const dodgePhrases = [
        'I need to think 😊',
        "You can't catch me! 🏃💨",
        'Nope, try again! 😜',
        'Still too slow! ✨',
        'Only YES is allowed! ❤️',
        'Look at the Yes button! 👉',
        'Not an option! 🥰'
    ];

    const runAway = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        dodgeCount++;

        // Update playful text
        const phraseIdx = Math.min(dodgeCount, dodgePhrases.length - 1);
        thinkBtn.textContent = dodgePhrases[phraseIdx];

        // Ensure wrap is positioned for absolute child
        if (wrap && getComputedStyle(wrap).position === 'static') {
            wrap.style.position = 'relative';
        }
        if (wrap && thinkBtn.parentElement !== wrap) {
            wrap.appendChild(thinkBtn);
        }

        thinkBtn.style.position = 'absolute';
        thinkBtn.style.zIndex = '15';

        // Calculate random coordinates inside container avoiding the Yes button
        const wrapW = wrap ? wrap.clientWidth : 320;
        const wrapH = wrap ? wrap.clientHeight : 280;
        const btnW = thinkBtn.offsetWidth || 140;
        const btnH = thinkBtn.offsetHeight || 44;

        const pad = 12;
        const maxLeft = Math.max(pad, wrapW - btnW - pad);
        const maxTop = Math.max(pad, wrapH - btnH - pad);

        const newLeft = pad + Math.random() * (maxLeft - pad);
        const newTop = pad + Math.random() * (maxTop - pad);

        thinkBtn.style.left = `${newLeft}px`;
        thinkBtn.style.top = `${newTop}px`;

        // Scale Yes button up with each dodge
        const scale = 1 + Math.min(dodgeCount * 0.12, 1.0);
        yesBtn.style.transform = `scale(${scale})`;

        messageBox.textContent = "Nice try! But only 'Yes' is allowed ❤️";

        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // Unclickable: dodges on hover, touch, pointer, focus, and click
    thinkBtn.addEventListener('mouseenter', runAway);
    thinkBtn.addEventListener('mouseover', runAway);
    thinkBtn.addEventListener('touchstart', runAway, { passive: false });
    thinkBtn.addEventListener('pointerdown', runAway, { passive: false });
    thinkBtn.addEventListener('click', runAway, { passive: false });
    thinkBtn.addEventListener('focus', runAway);

    yesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (yesBtn.dataset.firing === 'true') return;
        yesBtn.dataset.firing = 'true';

        yesBtn.style.transform = 'scale(1.1)';
        thinkBtn.style.display = 'none';

        messageBox.textContent = 'You just made me the happiest person alive! ❤️';
        launchCelebration();
        playCelebrationSong();

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 150]);
        }

        sendNotification('yes').finally(() => {
            setTimeout(() => { yesBtn.dataset.firing = 'false'; }, 200);
        });
    });
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
