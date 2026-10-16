const { chromium } = require('/root/.bun/install/global/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateAssets() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 800, deviceScaleFactor: 2 } });

  console.log('Rendering assets...');

  // 1. Logo EduSmart
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .logo-box { display: flex; align-items: center; gap: 14px; background: transparent; padding: 10px; }
        .icon { width: 56px; height: 56px; filter: drop-shadow(0 4px 12px rgba(13, 110, 253, 0.3)); }
        .text { display: flex; flex-direction: column; }
        .brand { font-size: 32px; font-weight: 900; color: #0d47a1; letter-spacing: -0.5px; line-height: 1; }
        .tagline { font-size: 13px; font-weight: 800; color: #64b5f6; letter-spacing: 2.5px; text-transform: uppercase; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="logo-box">
        <svg class="icon" viewBox="0 0 100 100" fill="none">
          <path d="M 12 76 C 12 76 30 68 50 74 C 70 68 88 76 88 76 L 88 28 C 88 28 70 20 50 26 C 30 20 12 28 12 28 Z" fill="#2563eb" />
          <path d="M 50 26 L 50 74" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          <path d="M 16 32 C 16 32 32 26 48 30 L 48 70 C 32 66 16 71 16 71 Z" fill="#60a5fa" />
          <path d="M 84 32 C 84 32 68 26 52 30 L 52 70 C 68 66 84 71 84 71 Z" fill="#3b82f6" />
        </svg>
        <div class="text">
          <span class="brand">EduSmart</span>
          <span class="tagline">ONLINE LEARNING</span>
        </div>
      </div>
    </body>
    </html>
  `);
  const logoEl = await page.$('.logo-box');
  await logoEl.screenshot({ path: path.join(publicDir, '01_logo_edusmart.png'), omitBackground: true });
  console.log('01_logo_edusmart.png created');

  // 2. Avatar Student (Nguyen Van A)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .avatar-wrap { width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(37,99,235,0.2); overflow: hidden; border: 4px solid #ffffff; }
      </style>
    </head>
    <body>
      <div class="avatar-wrap">
        <svg viewBox="0 0 120 120" width="130" height="130">
          <circle cx="60" cy="60" r="58" fill="#e2e8f0" />
          <!-- Hoodie body -->
          <path d="M 15 120 C 15 88 35 75 60 75 C 85 75 105 88 105 120 Z" fill="#2563eb" />
          <!-- Inner collar -->
          <path d="M 45 78 C 52 88 68 88 75 78 Z" fill="#ffffff" />
          <!-- Neck -->
          <rect x="52" y="60" width="16" height="20" fill="#fed7aa" rx="4" />
          <!-- Head / Face -->
          <circle cx="60" cy="50" r="24" fill="#ffedd5" />
          <!-- Cute cheeks -->
          <circle cx="48" cy="53" r="3.5" fill="#fca5a5" opacity="0.6" />
          <circle cx="72" cy="53" r="3.5" fill="#fca5a5" opacity="0.6" />
          <!-- Eyes -->
          <circle cx="52" cy="48" r="2.8" fill="#1e293b" />
          <circle cx="68" cy="48" r="2.8" fill="#1e293b" />
          <circle cx="53" cy="47" r="1" fill="#ffffff" />
          <circle cx="69" cy="47" r="1" fill="#ffffff" />
          <!-- Smile -->
          <path d="M 54 58 Q 60 63 66 58" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" fill="none" />
          <!-- Modern Korean style dark hair -->
          <path d="M 36 44 C 34 22 86 22 84 44 C 80 32 40 32 36 44 Z" fill="#1e293b" />
          <path d="M 42 28 Q 60 18 78 28 Q 60 22 42 28 Z" fill="#0f172a" />
        </svg>
      </div>
    </body>
    </html>
  `);
  const avatarEl = await page.$('.avatar-wrap');
  await avatarEl.screenshot({ path: path.join(publicDir, '03_avatar_student.png'), omitBackground: true });
  console.log('03_avatar_student.png created');

  // 3. Hero 3D Student Illustration (Mascot coding at desk)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .hero-stage { width: 500px; height: 420px; position: relative; display: flex; align-items: flex-end; justify-content: center; }
      </style>
    </head>
    <body>
      <div class="hero-stage">
        <svg viewBox="0 0 500 420" width="500" height="420">
          <defs>
            <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#eff6ff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#dbeafe" stop-opacity="0.4" />
            </linearGradient>
            <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#1d4ed8" />
            </linearGradient>
            <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1e3a8a" flood-opacity="0.12" />
            </filter>
            <filter id="floatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#3b82f6" flood-opacity="0.25" />
            </filter>
          </defs>

          <!-- Ambient soft aura -->
          <circle cx="280" cy="220" r="160" fill="url(#bgGlow)" filter="blur(20px)" />

          <!-- Floating Glassmorphism Badges -->
          <!-- Top Left: Graduation Hat Badge -->
          <g transform="translate(70, 70)" filter="url(#floatGlow)">
            <rect width="64" height="64" rx="20" fill="rgba(255, 255, 255, 0.85)" stroke="#dbeafe" stroke-width="2" />
            <path d="M 32 18 L 16 26 L 32 34 L 48 26 Z" fill="#2563eb" />
            <path d="M 22 30 L 22 42 C 22 46 42 46 42 42 L 42 30" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
            <path d="M 46 27 L 46 44" stroke="#3b82f6" stroke-width="2.5" />
            <circle cx="46" cy="44" r="2.5" fill="#3b82f6" />
          </g>

          <!-- Top Right: Video Play Badge -->
          <g transform="translate(390, 40)" filter="url(#floatGlow)">
            <rect width="60" height="60" rx="18" fill="rgba(255, 255, 255, 0.85)" stroke="#dbeafe" stroke-width="2" />
            <path d="M 24 18 L 42 30 L 24 42 Z" fill="#2563eb" />
          </g>

          <!-- Floating Video Mini Pill left side -->
          <g transform="translate(80, 160)" filter="url(#floatGlow)">
            <rect width="52" height="52" rx="16" fill="rgba(255, 255, 255, 0.8)" stroke="#dbeafe" stroke-width="2" />
            <path d="M 21 16 L 37 26 L 21 36 Z" fill="#3b82f6" />
          </g>

          <!-- Desk Surface -->
          <path d="M 20 375 L 480 375 C 480 375 490 380 480 395 L 20 395 Z" fill="#f1f5f9" filter="url(#softShadow)" />
          <line x1="20" y1="375" x2="480" y2="375" stroke="#e2e8f0" stroke-width="3" />

          <!-- Plant on the left desk -->
          <g transform="translate(35, 275)" filter="url(#softShadow)">
            <!-- Pot -->
            <path d="M 12 60 L 16 95 C 17 99 37 99 38 95 L 42 60 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
            <!-- Succulent leaves -->
            <path d="M 27 60 C 20 40 10 35 5 45 C 15 55 24 58 27 60 Z" fill="#22c55e" />
            <path d="M 27 60 C 27 30 20 20 27 15 C 34 20 30 45 27 60 Z" fill="#16a34a" />
            <path d="M 27 60 C 34 40 44 35 49 45 C 39 55 30 58 27 60 Z" fill="#4ade80" />
          </g>

          <!-- Coffee mug on the right desk -->
          <g transform="translate(390, 290)" filter="url(#softShadow)">
            <rect x="10" y="30" width="42" height="55" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
            <path d="M 52 40 C 66 40 66 65 52 65" fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round" />
          </g>

          <!-- Stack of textbooks on right desk -->
          <g transform="translate(250, 310)" filter="url(#softShadow)">
            <!-- Book 1 (Purple) -->
            <rect x="0" y="44" width="130" height="20" rx="4" fill="#8b5cf6" />
            <rect x="12" y="48" width="112" height="12" rx="2" fill="#ffffff" />
            <!-- Book 2 (Teal) -->
            <rect x="6" y="24" width="124" height="20" rx="4" fill="#06b6d4" />
            <rect x="18" y="28" width="106" height="12" rx="2" fill="#ffffff" />
          </g>

          <!-- Character - 3D Boy Body -->
          <g filter="url(#softShadow)">
            <!-- Chair Backrest -->
            <rect x="370" y="220" width="35" height="100" rx="14" fill="#64748b" opacity="0.5" />

            <!-- Hoodie Torso -->
            <path d="M 200 375 C 190 270 230 190 280 190 C 330 190 390 270 380 375 Z" fill="url(#hoodieGrad)" />
            <!-- Hoodie Sleeves & Arms typing -->
            <path d="M 230 240 C 200 280 230 320 260 325 L 290 325" stroke="url(#hoodieGrad)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M 330 240 C 360 280 320 320 300 325 L 270 325" stroke="url(#hoodieGrad)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            
            <!-- Hands -->
            <circle cx="260" cy="318" r="14" fill="#fed7aa" />
            <circle cx="295" cy="318" r="14" fill="#fed7aa" />

            <!-- Hoodie hood collar details -->
            <path d="M 250 205 C 265 235 295 235 310 205" fill="none" stroke="#1e40af" stroke-width="8" stroke-linecap="round" />
            <line x1="272" y1="220" x2="270" y2="255" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
            <line x1="288" y1="220" x2="290" y2="255" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />

            <!-- Neck -->
            <rect x="268" y="170" width="24" height="30" fill="#fed7aa" rx="6" />

            <!-- Head / 3D Face -->
            <ellipse cx="280" cy="140" rx="46" ry="50" fill="#ffedd5" />
            <!-- Cheeks -->
            <circle cx="254" cy="148" r="7" fill="#fca5a5" opacity="0.6" />
            <circle cx="306" cy="148" r="7" fill="#fca5a5" opacity="0.6" />
            <!-- Eyes -->
            <ellipse cx="262" cy="136" rx="5" ry="6" fill="#1e293b" />
            <ellipse cx="298" cy="136" rx="5" ry="6" fill="#1e293b" />
            <circle cx="264" cy="134" r="2" fill="#ffffff" />
            <circle cx="300" cy="134" r="2" fill="#ffffff" />
            <!-- Eyebrows -->
            <path d="M 254 124 Q 262 118 270 124" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none" />
            <path d="M 290 124 Q 298 118 306 124" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none" />
            <!-- Cute Smile -->
            <path d="M 268 158 Q 280 170 292 158" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />

            <!-- Ears -->
            <ellipse cx="234" cy="142" rx="7" ry="11" fill="#fed7aa" />
            <ellipse cx="326" cy="142" rx="7" ry="11" fill="#fed7aa" />

            <!-- Stylized Black Hair Volume -->
            <path d="M 234 130 C 225 75 335 75 326 130 C 315 100 245 100 234 130 Z" fill="#1e293b" />
            <path d="M 240 105 Q 280 80 320 100 Q 280 90 240 105 Z" fill="#0f172a" />
          </g>

          <!-- Modern Laptop (MacBook style) in front of hands -->
          <g filter="url(#softShadow)">
            <!-- Screen back facing viewer -->
            <path d="M 75 235 L 245 240 L 235 340 L 65 330 Z" fill="url(#laptopGrad)" stroke="#cbd5e1" stroke-width="2" rx="6" />
            <!-- Apple-like circular white logo -->
            <circle cx="155" cy="285" r="9" fill="#ffffff" opacity="0.9" />
            <!-- Base keyboard rim -->
            <path d="M 50 330 L 245 342 L 235 352 L 40 338 Z" fill="#64748b" />
          </g>

        </svg>
      </div>
    </body>
    </html>
  `);
  const heroEl = await page.$('.hero-stage');
  await heroEl.screenshot({ path: path.join(publicDir, '02_hero_student_illustration.png'), omitBackground: true });
  console.log('02_hero_student_illustration.png created');

  // 4. Course ReactJS Thumbnail
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .card { width: 320px; height: 160px; border-radius: 16px; background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(37,99,235,0.25); }
      </style>
    </head>
    <body>
      <div class="card">
        <svg viewBox="0 0 160 120" width="160" height="120">
          <defs>
            <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a5f3fc" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="60" rx="55" ry="20" fill="none" stroke="url(#cyanGlow)" stroke-width="4.5" transform="rotate(30 80 60)" />
          <ellipse cx="80" cy="60" rx="55" ry="20" fill="none" stroke="url(#cyanGlow)" stroke-width="4.5" transform="rotate(90 80 60)" />
          <ellipse cx="80" cy="60" rx="55" ry="20" fill="none" stroke="url(#cyanGlow)" stroke-width="4.5" transform="rotate(150 80 60)" />
          <circle cx="80" cy="60" r="14" fill="#ffffff" />
          <circle cx="80" cy="60" r="8" fill="#0284c7" />
        </svg>
      </div>
    </body>
    </html>
  `);
  const c1El = await page.$('.card');
  await c1El.screenshot({ path: path.join(publicDir, '04_course_reactjs_thumbnail.png') });
  console.log('04_course_reactjs_thumbnail.png created');

  // 5. Course UI/UX Design Thumbnail
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .card { width: 320px; height: 160px; border-radius: 16px; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #2dd4bf 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(20,184,166,0.25); }
      </style>
    </head>
    <body>
      <div class="card">
        <svg viewBox="0 0 160 120" width="160" height="120">
          <!-- Glass wireframe panel -->
          <rect x="25" y="20" width="110" height="80" rx="10" fill="rgba(255, 255, 255, 0.25)" stroke="#ffffff" stroke-width="2" />
          <rect x="35" y="32" width="40" height="26" rx="4" fill="rgba(255, 255, 255, 0.4)" />
          <rect x="85" y="32" width="40" height="6" rx="3" fill="#ffffff" />
          <rect x="85" y="44" width="30" height="6" rx="3" fill="rgba(255, 255, 255, 0.7)" />
          <rect x="85" y="56" width="36" height="6" rx="3" fill="rgba(255, 255, 255, 0.7)" />
          <!-- Chart curve -->
          <path d="M 35 85 L 55 70 L 75 78 L 95 62 L 125 72" fill="none" stroke="#f0fdfa" stroke-width="3" stroke-linecap="round" />
          <circle cx="95" cy="62" r="4" fill="#ffffff" />
        </svg>
      </div>
    </body>
    </html>
  `);
  const c2El = await page.$('.card');
  await c2El.screenshot({ path: path.join(publicDir, '05_course_uiux_thumbnail.png') });
  console.log('05_course_uiux_thumbnail.png created');

  // 6. Course Digital Marketing Thumbnail
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .card { width: 320px; height: 160px; border-radius: 16px; background: linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #c084fc 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(147,51,234,0.25); }
      </style>
    </head>
    <body>
      <div class="card">
        <svg viewBox="0 0 160 120" width="160" height="120">
          <!-- Rising bar charts -->
          <rect x="30" y="70" width="16" height="30" rx="4" fill="rgba(255,255,255,0.4)" />
          <rect x="54" y="55" width="16" height="45" rx="4" fill="rgba(255,255,255,0.6)" />
          <rect x="78" y="40" width="16" height="60" rx="4" fill="rgba(255,255,255,0.8)" />
          <rect x="102" y="25" width="16" height="75" rx="4" fill="#ffffff" />
          <!-- Upward Arrow -->
          <path d="M 25 75 Q 70 65 118 20" fill="none" stroke="#fdf4ff" stroke-width="4.5" stroke-linecap="round" />
          <polygon points="128,18 114,14 118,28" fill="#fdf4ff" />
        </svg>
      </div>
    </body>
    </html>
  `);
  const c3El = await page.$('.card');
  await c3El.screenshot({ path: path.join(publicDir, '06_course_marketing_thumbnail.png') });
  console.log('06_course_marketing_thumbnail.png created');

  // 7. Course Project Management Thumbnail
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .card { width: 320px; height: 160px; border-radius: 16px; background: linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(234,88,12,0.25); }
      </style>
    </head>
    <body>
      <div class="card">
        <svg viewBox="0 0 160 120" width="160" height="120">
          <!-- Kanban board mockup -->
          <rect x="25" y="25" width="32" height="70" rx="6" fill="rgba(255,255,255,0.25)" />
          <rect x="29" y="32" width="24" height="16" rx="3" fill="#ffffff" />
          <rect x="29" y="52" width="24" height="24" rx="3" fill="rgba(255,255,255,0.8)" />

          <rect x="64" y="25" width="32" height="70" rx="6" fill="rgba(255,255,255,0.25)" />
          <rect x="68" y="32" width="24" height="26" rx="3" fill="#ffffff" />
          <rect x="68" y="62" width="24" height="18" rx="3" fill="rgba(255,255,255,0.8)" />

          <rect x="103" y="25" width="32" height="70" rx="6" fill="rgba(255,255,255,0.25)" />
          <rect x="107" y="32" width="24" height="36" rx="3" fill="#ffffff" />
          <!-- Checkmark icon badge -->
          <circle cx="120" cy="50" r="7" fill="#10b981" />
          <path d="M 117 50 L 119 52 L 123 48" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
      </div>
    </body>
    </html>
  `);
  const c4El = await page.$('.card');
  await c4El.screenshot({ path: path.join(publicDir, '07_course_project_thumbnail.png') });
  console.log('07_course_project_thumbnail.png created');

  // 8. Upgrade Illustration
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .box { width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; }
      </style>
    </head>
    <body>
      <div class="box">
        <svg viewBox="0 0 160 160" width="160" height="160">
          <defs>
            <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#1e3a8a" flood-opacity="0.18" />
            </filter>
          </defs>
          <!-- 3D Folder / Box base -->
          <g filter="url(#boxShadow)">
            <rect x="25" y="60" width="110" height="70" rx="14" fill="#93c5fd" />
            <path d="M 25 70 C 25 64 30 60 36 60 L 60 60 L 72 72 L 124 72 C 130 72 135 77 135 83 L 135 125 C 135 131 130 136 124 136 L 36 136 C 30 136 25 131 25 125 Z" fill="#2563eb" />
            <!-- Floating Sheets -->
            <rect x="42" y="40" width="55" height="35" rx="6" fill="#ffffff" />
            <rect x="48" y="48" width="30" height="4" rx="2" fill="#cbd5e1" />
            <rect x="48" y="56" width="40" height="4" rx="2" fill="#cbd5e1" />
            <!-- Graduation Cap -->
            <path d="M 105 45 L 75 57 L 105 69 L 135 57 Z" fill="#1e3a8a" />
            <path d="M 85 62 L 85 75 C 85 80 125 80 125 75 L 125 62" fill="#1d4ed8" />
            <path d="M 132 58 L 132 78" stroke="#f59e0b" stroke-width="2.5" />
            <circle cx="132" cy="78" r="3" fill="#f59e0b" />
          </g>
        </svg>
      </div>
    </body>
    </html>
  `);
  const upEl = await page.$('.box');
  await upEl.screenshot({ path: path.join(publicDir, '08_upgrade_illustration.png'), omitBackground: true });
  console.log('08_upgrade_illustration.png created');

  // 9. Certificate Thumbnail
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .cert-card { width: 320px; height: 100px; background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(37,99,235,0.06); position: relative; overflow: hidden; }
        .left-wrap { display: flex; align-items: center; gap: 12px; }
        .react-box { width: 48px; height: 48px; border-radius: 10px; background: #f0f9ff; border: 1px solid #bae6fd; display: flex; align-items: center; justify-content: center; }
        .cert-info { display: flex; flex-direction: column; }
        .cert-type { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .cert-name { font-size: 14px; font-weight: 900; color: #1e293b; margin: 2px 0; }
        .cert-date { font-size: 10px; font-weight: 600; color: #64748b; }
        .seal { width: 36px; height: 36px; border-radius: 50%; background: #2563eb; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 8px rgba(37,99,235,0.3); }
      </style>
    </head>
    <body>
      <div class="cert-card">
        <div class="left-wrap">
          <div class="react-box">
            <svg viewBox="0 0 100 100" width="34" height="34">
              <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#0ea5e9" stroke-width="5" transform="rotate(30 50 50)" />
              <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#0ea5e9" stroke-width="5" transform="rotate(90 50 50)" />
              <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#0ea5e9" stroke-width="5" transform="rotate(150 50 50)" />
              <circle cx="50" cy="50" r="10" fill="#0284c7" />
            </svg>
          </div>
          <div class="cert-info">
            <span class="cert-type">Chứng chỉ</span>
            <span class="cert-name">ReactJS Developer</span>
            <span class="cert-date">Đã đạt ngày 15/05/2024</span>
          </div>
        </div>
        <div class="seal">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" stroke-width="2.5">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
      </div>
    </body>
    </html>
  `);
  const certEl = await page.$('.cert-card');
  await certEl.screenshot({ path: path.join(publicDir, '09_certificate_thumbnail.png'), omitBackground: true });
  console.log('09_certificate_thumbnail.png created');

  await browser.close();
  console.log('All 9 assets successfully generated!');
}

generateAssets().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
