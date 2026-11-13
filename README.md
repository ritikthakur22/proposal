# For You, My Love 💌💍

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-Ready-222222?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <b>An interactive, heartfelt proposal and memory website designed to celebrate your love story.</b><br>
  Built with smooth single-page routing, floating heart animations, background serenade music, and a playful interactive proposal card.
</p>

---

## ✨ Features

- 🌸 **Gentle Aesthetic & Atmosphere:** Soft blush rose palette, glowing aurora gradients, floating glassmorphism cards, and floating heart particles.
- 📖 **Our Story:** Dedicated memory grid sharing when you met, your first memory, and unforgettable moments.
- 💌 **Love Letter:** Elegant typography letter with an interactive typewriter intro and expandable read-more section.
- 🎶 **Serenade Music Player:** Built-in audio player featuring Bruno Mars & Lady Gaga's *"Die With A Smile"*.
- 💍 **Interactive Proposal Finale:**
  - **"Yes" Button:** Triggers a heart-confetti celebration and celebratory music.
  - **"I need to think" Button:** Playfully dodges the cursor on desktop and jumps away on mobile touch!
- ⚡ **GitHub Pages Optimized:** Fully static, zero-backend required, fast CDN loading, and seamless `#hash` SPA routing.

---

## 🚀 Hosting on GitHub Pages (Free & Automatic)

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Quick Setup:
1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. On GitHub, navigate to **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select:
   * **GitHub Actions** (recommended — deploys automatically on every commit)  
   * *OR* select **Deploy from a branch** &rarr; choose `main` branch &rarr; `/ (root)` folder &rarr; Save.
4. Your website will be live in ~1 minute at:
   ```text
   https://<your-username>.github.io/proposal/
   ```

---

## 🎨 Personalizing the Experience

All text and memories are cleanly contained within `<template>` blocks inside `index.html`:

| Section | Location | How to Customize |
|---|---|---|
| **Our Story** | `<template id="tmpl-story">` | Edit the headings, dates, and paragraph memories in the story cards. |
| **Love Letter** | `<template id="tmpl-letter">` | Write your personal message inside `<div class="expandable">`. |
| **Audio Song** | `/audio/` | Place your MP3 file in `audio/` and update the filename in `index.html` & `script.js`. |
| **Photos** | `index.html` | Insert your favorite pictures inside the story grid. |

---

## 🔔 Setting Up Safe Notifications (Optional)

To keep this repository safe for public hosting on GitHub, **never paste raw Discord webhook URLs into client-side JavaScript** (GitHub & Discord will detect and revoke them immediately).

If you want an instant Discord ping when your partner clicks **"Yes"**, use a free serverless proxy:

### Option A: Free Cloudflare Worker Proxy (Recommended)
1. Create a free account at [Cloudflare Workers](https://workers.cloudflare.com/).
2. Create a new Worker and paste:
   ```javascript
   export default {
     async fetch(request, env) {
       if (request.method !== "POST") return new Response("OK");
       const data = await request.json();
       await fetch(env.DISCORD_WEBHOOK_URL, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           content: `💍 **Proposal Alert!**\nPartner clicked: **${data.action}**\nTime: ${data.timestamp}`
         })
       });
       return new Response("Delivered", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
     }
   };
   ```
3. In your Cloudflare Worker settings, add an encrypted Environment Variable: `DISCORD_WEBHOOK_URL = your_secret_webhook`.
4. In `script.js`, set:
   ```javascript
   const NOTIFICATION_ENDPOINT = 'https://your-worker-name.your-subdomain.workers.dev';
   ```

---

## 💻 Local Preview

To run and preview the site locally on your machine:

```bash
# Using Python
python3 -m http.server 8000

# Open in browser:
# http://localhost:8000
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
