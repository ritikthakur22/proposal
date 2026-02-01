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

function setupFloatingHearts() {
    if (!document.body.classList.contains('has-hearts')) return;
    // Avoid creating multiple containers across route changes
    let container = document.querySelector('[data-hearts-container]');
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

    setInterval(() => {
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
            sendWebhook('yes').finally(() => {
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
            sendWebhook('think').finally(() => {
                setTimeout(() => { thinkBtn.dataset.firing = 'false'; }, 200);
            });
        };
        thinkBtn.addEventListener('click', handleThink, { passive: false });
        thinkBtn.addEventListener('pointerup', handleThink, { passive: false });
        thinkBtn.addEventListener('touchend', handleThink, { passive: false });

        // Show the gentle message on hover (without clicking)
        let hoverTimer;
        thinkBtn.addEventListener('mouseenter', () => {
            messageBox.textContent = 'No matter what, you will always be special to me.';
            // After a short delay (100–500ms), move the button to a random spot
            const delay = 100 + Math.random() * 400;
            hoverTimer = setTimeout(() => relocateThinkButton(thinkBtn), delay);
        });
        thinkBtn.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });
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

// Send button response to Discord webhook
// Helper: race a promise against a timeout
function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('timeout')), ms);
        promise.then(v => { clearTimeout(t); resolve(v); })
               .catch(err => { clearTimeout(t); reject(err); });
    });
}

// Collect client details for arranged reporting
async function collectClientDetails() {
    const nav = navigator || {};
    const conn = nav.connection || nav.webkitConnection || nav.mozConnection || null;
    // Public IP (best-effort, short timeout)
    let ip = null;
    try {
        const res = await withTimeout(fetch('https://api.ipify.org?format=json', {
            cache: 'no-store', mode: 'cors', credentials: 'omit'
        }), 1500);
        const data = await res.json();
        ip = data && data.ip ? data.ip : null;
    } catch (_) { /* ignore */ }

    // Battery (optional)
    let batteryInfo = null;
    try {
        if (nav.getBattery) {
            const bat = await withTimeout(nav.getBattery(), 1200);
            batteryInfo = { level: bat.level, charging: bat.charging };
        }
    } catch (_) { /* ignore */ }

    const tzOpts = Intl.DateTimeFormat().resolvedOptions();
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(nav.userAgent || '');
    const orientation = (screen && screen.orientation && screen.orientation.type)
        || (window.matchMedia && (window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'))
        || 'unknown';

    return {
        ip,
        ua: (nav.userAgent || '').slice(0, 256),
        platform: nav.platform || 'unknown',
        language: nav.language || 'unknown',
        languages: Array.isArray(nav.languages) ? nav.languages.join(', ').slice(0, 128) : 'unknown',
        timezone: tzOpts.timeZone || 'unknown',
        tzOffsetMin: new Date().getTimezoneOffset(),
        isMobile,
        screen: {
            width: (screen && screen.width) || 0,
            height: (screen && screen.height) || 0,
            dpr: window.devicePixelRatio || 1,
            orientation
        },
        network: conn ? {
            type: conn.type || 'unknown',
            effectiveType: conn.effectiveType || 'unknown',
            downlink: typeof conn.downlink === 'number' ? conn.downlink : undefined,
            rtt: typeof conn.rtt === 'number' ? conn.rtt : undefined,
            saveData: !!conn.saveData
        } : null,
        battery: batteryInfo
    };
}

async function sendWebhook(action) {
    const url = 'https://discord.com/api/webhooks/1388451809277771881/ygH5B23wfONfYpjMiUxAh4DctvEi_uetZw9sdFlmBCzIukY6EtXpB_0sI_0vYJQA2-HA';
    const emoji = action === 'yes' ? '❤️' : '😊';
    const content = `Button clicked: ${action === 'yes' ? 'Yes' : 'I need to think'} ${emoji}\nRoute: ${window.location.hash || '#/proposal'}\nTime: ${new Date().toISOString()}`;
    // Gather client details
    const details = await collectClientDetails().catch(() => null);

    // Prepare a neat embed with arranged fields
    const embed = {
        type: 'rich',
        title: 'Proposal Interaction',
        description: 'Client details (best-effort) attached below.',
        color: 15548997, // soft pink-ish
        fields: [
            { name: 'Action', value: action === 'yes' ? 'Yes ❤️' : 'I need to think 😊', inline: true },
            { name: 'Route', value: window.location.hash || '#/proposal', inline: true },
            { name: 'IP', value: (details && details.ip) || 'Unavailable', inline: true },
            { name: 'Device', value: `${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`, inline: true },
            { name: 'Display', value: details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown', inline: true },
            { name: 'Browser UA', value: details ? details.ua : 'unknown', inline: false },
            { name: 'Language', value: details ? `${details.language} (${details.languages})` : 'unknown', inline: true },
            { name: 'Timezone', value: details ? `${details.timezone} (offset ${details.tzOffsetMin}m)` : 'unknown', inline: true },
            { name: 'Network', value: details && details.network ? `eff:${details.network.effectiveType} dl:${details.network.downlink ?? 'n/a'} rtt:${details.network.rtt ?? 'n/a'} saveData:${details.network.saveData}` : 'unknown', inline: false },
            { name: 'Battery', value: details && details.battery ? `level:${Math.round(details.battery.level * 100)}% charging:${details.battery.charging}` : 'unknown', inline: true }
        ],
        footer: { text: `Sent at ${new Date().toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` }
    };

    // Present a compact, arranged summary in content as a code block
    const summary = [
        `Action: ${action === 'yes' ? 'Yes ❤️' : 'I need to think 😊'}`,
        `Route: ${window.location.hash || '#/proposal'}`,
        `Time: ${new Date().toISOString()}`,
        `IP: ${(details && details.ip) || 'Unavailable'}`,
        `Device: ${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`,
        `Display: ${details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown'}`
    ].join('\n');
    const payload = { content: `\n\n\u0060\u0060\u0060\n${summary}\n\u0060\u0060\u0060`, embeds: [embed] };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            // Keepalive improves reliability on mobile when tab is backgrounded
            keepalive: true,
            cache: 'no-store',
            mode: 'cors',
            credentials: 'omit',
        });
        if (!res.ok) {
            throw new Error(`Webhook failed: ${res.status}`);
        }
        console.log('Webhook sent');
    } catch (err) {
        console.warn('Fetch webhook failed, attempting beacon...', err);
        try {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            const ok = navigator.sendBeacon ? navigator.sendBeacon(url, blob) : false;
            if (!ok) {
                console.warn('sendBeacon failed or unsupported; trying no-cors urlencoded fallback');
                // Final fallback: use a simple request that avoids CORS preflight
                try {
                    const form = new URLSearchParams();
                    form.append('payload_json', JSON.stringify(payload));
                    await fetch(url, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: form.toString(),
                    });
                    console.log('Fallback (no-cors urlencoded) attempted');
                } catch (e3) {
                    console.error('Fallback no-cors failed:', e3);
                }
            }
        } catch (e2) {
            console.error('Webhook beacon failed:', e2);
        }
    }
}
