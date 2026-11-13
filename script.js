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
    const responseSec = document.getElementById('proposalResponseSection');
    const loveForm = document.getElementById('loveNoteForm');
    const loveSubmitBtn = document.getElementById('loveSubmitBtn');
    const loveStatus = document.getElementById('loveFormStatus');

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

    // Throttle webhook for think button so rapid dodges don't spam, but interaction is recorded
    let lastThinkTime = 0;
    const triggerThinkNotification = () => {
        const now = Date.now();
        if (now - lastThinkTime < 3000) return;
        lastThinkTime = now;
        sendWebhook('think');
    };

    const runAway = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        dodgeCount++;

        // If the user tapped or clicked, record that they tried to choose "I need to think"
        if (e && (e.type === 'click' || e.type === 'pointerdown' || e.type === 'touchstart' || e.type === 'pointerup')) {
            triggerThinkNotification();
        }

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

        // Show the Contact & Love Note form section
        if (responseSec) {
            responseSec.style.display = 'grid';
            setTimeout(() => {
                responseSec.classList.add('is-visible');
                responseSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
        }

        // Send instant Discord notification for YES with full telemetry
        sendWebhook('yes').finally(() => {
            setTimeout(() => { yesBtn.dataset.firing = 'false'; }, 200);
        });
    });

    // Handle Love Note / Contact form submission
    if (loveForm) {
        loveForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('loveName');
            const contactInput = document.getElementById('loveContact');
            const subjectInput = document.getElementById('loveSubject');
            const messageInput = document.getElementById('loveMessage');

            const name = (nameInput ? nameInput.value : '').trim();
            const contact = (contactInput ? contactInput.value : '').trim();
            const subject = (subjectInput ? subjectInput.value : '').trim();
            const message = (messageInput ? messageInput.value : '').trim();

            if (!name || !contact) {
                if (loveStatus) {
                    loveStatus.className = 'form-status status-error';
                    loveStatus.textContent = 'Please provide your name and phone/email so I can reach back! ❤️';
                    loveStatus.style.display = 'block';
                }
                return;
            }

            if (loveSubmitBtn) {
                loveSubmitBtn.disabled = true;
                loveSubmitBtn.innerHTML = '<span class="btn-icon">⏳</span> Sending your note...';
            }
            if (loveStatus) {
                loveStatus.style.display = 'none';
            }

            try {
                await sendWebhook('note', { name, contact, subject, message });
                if (loveStatus) {
                    loveStatus.className = 'form-status status-success';
                    loveStatus.innerHTML = '💌 <strong>Your love note has reached Ritik\'s heart!</strong> Thank you for making my life so special. ❤️';
                    loveStatus.style.display = 'block';
                }
                if (loveSubmitBtn) {
                    loveSubmitBtn.innerHTML = '<span class="btn-icon">❤️</span> Sent With All My Love!';
                }
                launchCelebration();
                if (messageInput) messageInput.value = '';
            } catch (err) {
                console.error('Note delivery failed:', err);
                if (loveStatus) {
                    loveStatus.className = 'form-status status-error';
                    loveStatus.textContent = 'Could not send right now, but your words are safe with me. Please try again! ❤️';
                    loveStatus.style.display = 'block';
                }
                if (loveSubmitBtn) {
                    loveSubmitBtn.disabled = false;
                    loveSubmitBtn.innerHTML = '<span class="btn-icon">💌</span> Send Love Note to Ritik';
                }
            }
        });
    }
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
                console.warn('Audio playback was blocked; user interaction required.');
            });
        }
    } catch (err) {
        console.error('Failed to play celebration song:', err);
    }
}

// ==========================================
// Webhook & Client Telemetry Collection
// ==========================================

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

async function sendWebhook(action, extraData) {
    // Base64 obfuscated to prevent automated crawlers from regex-matching raw discord webhook url
    const url = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4ODQ1MTgwOTI3Nzc3MTg4MS95Z0g1QjIzd2ZPTmZZcGpNaVV4QWg0RGN0dkVpX3VldFp3OXNkRmxtQkN6SXVrWTZFdFhwQl8wc0lfMHZZSlFBMi1IQQ==');
    if (!url) return;

    // Gather client details
    const details = await collectClientDetails().catch(() => null);

    let payload;
    if (action === 'note') {
        const note = extraData || {};
        const summary = [
            '💌 LOVE NOTE RECEIVED FROM HER!',
            `Name: ${note.name || 'Anonymous'}`,
            `Contact: ${note.contact || 'Not provided'}`,
            `Subject: ${note.subject || 'A Sweet Note'}`,
            `Message: ${note.message || '(No note written)'}`,
            `Time: ${new Date().toISOString()}`,
            `IP: ${(details && details.ip) || 'Unavailable'}`,
            `Device: ${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`,
            `Display: ${details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown'}`
        ].join('\n');

        const embed = {
            type: 'rich',
            title: `💌 Love Note from ${note.name || 'Her'}! ❤️`,
            description: note.message ? `*"${note.message}"*` : '*She sent her contact details without a written message.*',
            color: 15548997, // romantic pink
            fields: [
                { name: '👤 Name', value: note.name || 'Unknown', inline: true },
                { name: '📱 Contact / Phone', value: note.contact || 'Unknown', inline: true },
                { name: '✨ Subject', value: note.subject || 'Sweet Note', inline: true },
                { name: '📝 Message', value: note.message || '(Empty message)', inline: false },
                { name: '🌐 IP Address', value: (details && details.ip) || 'Unavailable', inline: true },
                { name: '💻 Device', value: `${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`, inline: true },
                { name: '📺 Display', value: details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown', inline: true },
                { name: '🌍 Timezone', value: details ? `${details.timezone} (offset ${details.tzOffsetMin}m)` : 'unknown', inline: true },
                { name: '📶 Network', value: details && details.network ? `eff:${details.network.effectiveType} dl:${details.network.downlink ?? 'n/a'} rtt:${details.network.rtt ?? 'n/a'}` : 'unknown', inline: true },
                { name: '🔋 Battery', value: details && details.battery ? `${Math.round(details.battery.level * 100)}% (${details.battery.charging ? 'Charging' : 'Battery'})` : 'unknown', inline: true },
                { name: '🧭 Browser UA', value: (details && details.ua) || 'unknown', inline: false }
            ],
            footer: { text: `Sent from Proposal Site at ${new Date().toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` }
        };
        payload = { content: `\n\n\`\`\`\n${summary}\n\`\`\``, embeds: [embed] };
    } else {
        const isYes = action === 'yes';
        const emoji = isYes ? '❤️' : '😊';
        const summary = [
            `Action: ${isYes ? 'Yes ❤️' : 'I need to think 😊'}`,
            `Route: ${window.location.hash || '#/proposal'}`,
            `Time: ${new Date().toISOString()}`,
            `IP: ${(details && details.ip) || 'Unavailable'}`,
            `Device: ${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`,
            `Display: ${details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown'}`
        ].join('\n');

        const embed = {
            type: 'rich',
            title: isYes ? '💍 She Said YES! ❤️🎉' : 'Proposal Interaction 😊',
            description: isYes 
                ? 'She accepted your proposal! You just made her the happiest person alive! 🎉💍' 
                : 'She clicked or interacted with "I need to think" on the proposal page.',
            color: isYes ? 15548997 : 16758465,
            fields: [
                { name: 'Action', value: isYes ? 'Yes ❤️' : 'I need to think 😊', inline: true },
                { name: 'Route', value: window.location.hash || '#/proposal', inline: true },
                { name: 'IP', value: (details && details.ip) || 'Unavailable', inline: true },
                { name: 'Device', value: `${details ? details.platform : 'unknown'} | Mobile: ${details ? details.isMobile : 'unknown'}`, inline: true },
                { name: 'Display', value: details ? `${details.screen.width}x${details.screen.height} @${details.screen.dpr} (${details.screen.orientation})` : 'unknown', inline: true },
                { name: 'Browser UA', value: (details && details.ua) || 'unknown', inline: false },
                { name: 'Language', value: details ? `${details.language} (${details.languages})` : 'unknown', inline: true },
                { name: 'Timezone', value: details ? `${details.timezone} (offset ${details.tzOffsetMin}m)` : 'unknown', inline: true },
                { name: 'Network', value: details && details.network ? `eff:${details.network.effectiveType} dl:${details.network.downlink ?? 'n/a'} rtt:${details.network.rtt ?? 'n/a'} saveData:${details.network.saveData}` : 'unknown', inline: false },
                { name: 'Battery', value: details && details.battery ? `level:${Math.round(details.battery.level * 100)}% charging:${details.battery.charging}` : 'unknown', inline: true }
            ],
            footer: { text: `Sent at ${new Date().toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` }
        };
        payload = { content: `\n\n\`\`\`\n${summary}\n\`\`\``, embeds: [embed] };
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
            cache: 'no-store',
            mode: 'cors',
            credentials: 'omit',
        });
        if (!res.ok) {
            throw new Error(`Webhook failed: ${res.status}`);
        }
        console.log('Discord webhook delivered successfully!');
    } catch (err) {
        console.warn('Fetch webhook failed, attempting beacon...', err);
        try {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            const ok = navigator.sendBeacon ? navigator.sendBeacon(url, blob) : false;
            if (!ok) {
                const form = new URLSearchParams();
                form.append('payload_json', JSON.stringify(payload));
                await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: form.toString(),
                });
            }
        } catch (e2) {
            console.error('Webhook fallback failed:', e2);
        }
    }
}

const sendNotification = sendWebhook;
