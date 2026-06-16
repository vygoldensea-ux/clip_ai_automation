# Remotion Clip Prompt Reference

Tai lieu nay luu lai cac prompt mau da dua, kem phan phan tich de tham khao khi viet prompt tao clip Remotion cho nhieu the loai noi dung khac nhau.

## Prompt Goc

### 1. Article Screenshot / OCR Highlight

```text
use remotion best practices. import the following image into the project: '~/Desktop/Screenshot 2026-01-31 at 17.15.12.png' use tesseract CLI to do OCR and find the positions of the text. in remotion, make a new composition where you load the image and pad the article generously on a white full HD background. while the composition is running for 5 seconds, slowly, very subtly, zoom into it and slightly rotate the article in 3d from left to right. the overall rotation should be around 15deg for each axis. at the beginning, blur the whole composition and unblur it over 1 second. after the blur is done, evolve a highlighter from left to right using rough.js over the words "government shutdown" and "funding lapses". the image has a white background. make sure the the marker appears behind the text. when installing new dependencies, check for existing lockfiles and use the right package manager.
```

### 2. Disc Depot Promotion Video

```text
Use Remotion best practices skill. Create a 30-second video at 30fps. Start with a hook: white text on black background, 'Where do you even buy music anymore?' — fade it in, hold for 2 seconds, fade out.

Next section: show the Disc Depot logo from public/discdepot-logo.png. Use a warm orange gradient background. Add a subtle tagline below: 'Music, delivered.’.

In the next section, add a counter that counts up to 12,000 with a plus sign. Label it 'Happy customers'. Keep the same background style.

Create 5 CD album covers as abstract gradient cards. Different color combinations. Animate them sliding in one by one, arranged in a row.

Add artist names and song titles.

Let’s add a final section:
End with a call to action: 'Find your sound.' and the URL 'discdepot.com'. Fade to black.

Let’s improve the transition between series. For example: orange in the second section should interpolate from black to orange. Now it’s just not too smooth. And improve that between sections.

# A lot of refining prompts followed.

Very nice! Can you make logo react to audio using `useAudioData` hook? https://www.remotion.dev/docs/use-windowed-audio-data.md

Can you make ALL scenes audio reactive? So that all elements dance to the music frequencies?

I want everything react to low frequencies only
```

### 3. Bar + Line Chart

```text
Create a 1920x1080 dark-themed (#1A1A2E) composition called 'BarLineChart' with a combination chart showing monthly sales data — bars for revenue ($8K, $12K, $15K, $11K, $18K, $22K for Jan-Jun) that grow upward from the baseline, overlaid with a blue (#0B84F3) line tracking conversion rate (2.1%, 2.8%, 3.2%, 2.9%, 3.8%, 4.2%) that draws progressively with a glowing effect, bars animate sequentially with slight overlap while the line follows behind, include axis labels and a pulsing dot marker at the line tip, smooth spring-based timing over 120 frames at 30fps — use remotion-best-practices skill.
```

### 4. VVTerm Apple-Style Promo

```text
Make a promotion video in Apple presentation style for VVTerm. Check its website VVTerm.com for details and assets like logo. Use nerd fonts and inter. Make it around 20 seconds.
```

### 5. SpaceX Launch Timeline

```text
Animate every SpaceX rocket launch from 2015–2025 in chronological order. Show the launch parabolas with trajectory fading. Use an abstract, minimalist aesthetic. Give me three versions first, then I’ll pick one and refine it via feedback.
```

### 6. OpenClawd Product Video

```text
Create a Remotion video (1080x700, 30fps, ~37s) for OpenClawd — an open source AI desktop agent. Dark theme (#0c0a09
  background, #fbbf24 amber accent). Background music: "Walen - HEADPHONK" with 1s fade-in and 2s fade-out at 40% volume. 8
  scenes in series:

  Scene 1 — Terminal Install (120 frames / 4s)
  Mac-style terminal window with traffic light dots. Types npx openclawd-cli character by character (1 frame/char). After
  typing, shows ASCII art logo "OPENCLAWD" in amber, then server output lines appearing progressively: version banner, SDK
  backends, 20+ providers/80+ models loaded, model names (Opus 4.6, GPT-5.3, Gemini 3, etc.), MCP servers connected, "Opening
  desktop app on :3001". Terminal slides in from bottom with 3D perspective (rotateX 20deg, slight rotateY oscillation).

  Scene 2 — Home Screen (150 frames / 5s)
  Desktop app window with centered "OpenClawd" title (Georgia serif), tagline "Open Source Alternative to Claude Cowork",
  rounded chat input with send button, and provider/model selector chips (Claude Code + Opus 4.6 + Attach). Spring-animated
  fade-in with staggered delays (title → tagline → input → controls).

  Scene 3 — Chat Interface (160 frames / 5.3s)
  Three-column layout: left sidebar with chat history (MCP Integration, Code Review, etc.), center with user message "Review my
   API code" and streaming assistant response about security findings (rate limiting, SQL injection, input validation), right
  panel showing progress steps (Reading → Security analysis → Applying fixes → Creating PR) and tool calls (filesystem.read,
  bash.exec, github.create_pr) with green checkmarks.

  Scene 4 — Provider Switch (130 frames / 4.3s)
  Two dropdown panels side by side. Left: 8 providers (Claude Code, OpenCode, OpenAI, Gemini, DeepSeek, Llama 4, MiniMax,
  Ollama) with colored dots and selection indicator. Right: 7 models (Opus 4.6, Sonnet 4.5, GPT-5.3 Codex, etc.) with
  descriptions. Bottom tagline: "Claude Code + OpenCode SDK — 20+ providers · Open Source models". Staggered item reveals.

  Scene 5 — MCP Catalog (140 frames / 4.7s)
  Modal overlay with "MCP Server Catalog — 20+ servers available". Category filter pills (All, Core, Database, Developer,
  Communication). 6 server cards with icons: Filesystem, Git, GitHub (installed), PostgreSQL, Slack, Puppeteer. Auth badges
  (green "No Auth" / amber "Requires Auth"). Install/Installed buttons with checkmarks.

  Scene 6 — Messaging Bots (120 frames / 4s)
  Full-screen "Your AI, everywhere you chat" with subtitle "Full tool access · Memory · Scheduling". 4 platform cards
  (WhatsApp, Telegram, Signal, iMessage) with SVG icons, green "Connected" status dots, and feature tags (Memory, Scheduling,
  Tools). Cards scale up with spring animation.

  Scene 7 — Logo Combo (180 frames / 6s)
  Three sub-scenes: (a) Intro with converging amber lines, center burst ring, floating particles, grid background. (b) "✦
  Introducing ✦" with word-by-word reveal: "Open Source AI Desktop" in 56px white text, model names below in gray monospace.
  (c) 8 provider icons in two rows with colored dots and labels, tagline "Claude Code + OpenCode SDK · 80+ models | Desktop ·
  Messaging · API".

  Scene 8 — GitHub CTA (120 frames / 4s)
  "100% OPEN SOURCE" label, spinning GitHub logo (rotates in from -180deg), orbiting amber star icons, "Star us on GitHub" in
  36px white, pulsing scale animation, "github.com/rohitg00/openclawd" in monospace with dark card background. Floating
  particles and subtle grid.

  All transitions use spring animations with fade + scale (0.95→1 in, 1→0.95 out). Each scene inside an AppWindow component
  (mac chrome with traffic lights). Color palette: #0c0a09 bg, #1c1917 surfaces, #292524 borders, #fbbf24 amber accent, #fafaf9
   white text, #a8a29e muted text, #78716c dim text. Fonts: Inter for UI, SF Mono for code, Georgia for branding.
```

### 7. Map Trip LA -> NY -> Paris

```text
use remotion best practices. make a new composition and add a map and zoom out of LA while staying focused on it. once done, animate a line from LA to NY and make the camera follow it.

add another stop to the trip, this time we go to paris. animate the eiffel tower and show it in 3D!
```

## Phan Tich Theo The Loai

### 1. Screenshot / Article Explainer

Dung khi can bien anh chup man hinh, bai bao, tai lieu, email, report thanh clip ngan.

Cong thuc hay:

- Dau vao ro rang: duong dan anh, kich thuoc composition, thoi luong, fps.
- Dung OCR de tim vi tri chu thay vi canh thu cong.
- Tao background sach: nen trang hoac mau trung tinh, padding rong de bai viet tho hon.
- Chuyen dong camera rat nhe: zoom cham, rotate 3D tinh te, blur vao dau clip.
- Highlighter phai nam sau chu, khong che text.
- Highlight xuat hien sau khi mat nguoi xem da focus: vi du blur het trong 1s, sau do ke marker.

Mau prompt nen dung:

```text
Create a Remotion composition from [image/document]. Use OCR to detect text positions. Place the article on a clean [background] with generous padding. Animate a subtle camera move for [duration]. Highlight the phrases [phrases] with a hand-drawn marker behind the text after the intro blur resolves.
```

### 2. Brand / Product Promo

Dung cho logo, san pham, startup, app, landing page, thuong hieu.

Cong thuc hay:

- Mo dau bang hook ngan, manh, de nguoi xem dung lai.
- Moi section chi nen co mot y: hook, logo, proof, feature, CTA.
- Giu mot background style xuyen suot de clip co nhan dien.
- Chuyen canh nen interpolate mau va motion, khong cat dot ngot.
- CTA cuoi ngan: brand promise + URL.
- Neu co audio, cho cac thanh phan "dance" theo low frequencies de tao cam giac nhac nhung khong roi mat.

Mau cau truc:

```text
Scene 1: Hook text on black.
Scene 2: Logo reveal on brand gradient.
Scene 3: Social proof / counter.
Scene 4: Product or content cards.
Scene 5: CTA and URL, fade to black.
```

### 3. Audio-Reactive Promo

Dung cho clip quang cao co nhac nen, logo, album, brand, social video.

Cong thuc hay:

- Dung `useAudioData` / windowed audio data de lay nang luong tan so.
- Neu muon sang trong, chi cho react voi low frequencies.
- Apply audio energy vao scale, glow, shadow, rotate, y-offset, blur hoac line thickness.
- Gioi han bien do nho de tranh bi "nhay loang xoang".
- Tat ca scene cung react voi mot he amplitude chung de cam giac dong bo.

Mau prompt:

```text
Make all scenes subtly audio reactive using low-frequency energy only. Map bass amplitude to scale, glow, small vertical movement, and background intensity. Keep the motion restrained and premium.
```

### 4. Data Visualization / Chart Animation

Dung cho KPI, sales, analytics, dashboard, investor update.

Cong thuc hay:

- Ghi ro data, mau sac, kich thuoc, ten composition.
- Bars nen animate grow tu baseline.
- Line nen draw progressively bang SVG strokeDashoffset.
- Cho line chay sau bars mot nhip de co layering.
- Dot marker o dau line giup nguoi xem biet dang doc diem nao.
- Theme toi + glow vua phai phu hop voi data clip hien dai.

Mau prompt:

```text
Create a [resolution] composition showing [data]. Bars animate upward sequentially from baseline. Overlay a glowing line that draws progressively after the bars. Add axis labels, value labels, and a pulsing marker at the current line tip. Use spring timing over [frames].
```

### 5. Apple-Style Product Presentation

Dung cho app, terminal tool, SaaS, developer product.

Cong thuc hay:

- Website/product details nen duoc research truoc khi lam.
- Visual can it chu, nhieu khoang trong, typography lon.
- Logo, screenshot, terminal, UI mockup phai la trung tam.
- Motion cham, dung fade/scale/slide rat sach.
- Font: Inter, SF Pro, SF Mono, Nerd Fonts neu la developer tool.
- Nen co nhieu "hero moments": logo reveal, feature line, UI showcase, CTA.

Mau prompt:

```text
Make an Apple-style product promo for [product]. Research [website] for positioning and assets. Use restrained typography, premium spacing, clean UI mockups, slow elegant transitions, and a concise CTA. Duration around [seconds].
```

### 6. Historical / Chronological Visualization

Dung cho SpaceX launches, timeline su kien, dia ly, lich su, data theo nam.

Cong thuc hay:

- Yeu cau chronological order.
- Neu data co the thay doi, can research / source ro.
- Nen xin 3 visual directions truoc khi implement neu de tai lon.
- Abstract/minimalist giup giam tai khi co nhieu event.
- Dung fading trails, timeline ticks, cumulative motion de cho thay tien trinh.

Mau prompt:

```text
Animate [events] from [start year] to [end year] in chronological order. Use a minimalist visual system with fading trajectories, cumulative traces, and year markers. First propose 3 visual directions before implementation.
```

### 7. Multi-Scene App Demo / Startup Explainer

Dung cho AI agent, open-source tool, devtool, platform co nhieu tinh nang.

Cong thuc hay:

- Chia scene bang thoi luong frame cu the.
- Moi scene co mot UI surface nhat quan, vi du `AppWindow`.
- Define palette, font, surface, border, muted text, accent.
- Dung staggered reveal cho UI phuc tap.
- Co terminal install de tao cam giac developer-real.
- Co product flow: install -> home -> chat/use case -> providers -> integrations -> everywhere -> identity -> CTA.
- Ket hop micro animations: typing, checkmarks, progress, icons, particles, grid.

Mau cau truc:

```text
Scene 1: Install / terminal proof.
Scene 2: Home / positioning.
Scene 3: Main workflow.
Scene 4: Options / providers.
Scene 5: Integrations / ecosystem.
Scene 6: Cross-platform use.
Scene 7: Brand reveal / capability summary.
Scene 8: CTA / GitHub / URL.
```

### 8. Map / Travel / Route Animation

Dung cho hanh trinh, logistics, travel, migration, flight, story dia ly.

Cong thuc hay:

- Camera move nen co story: start close, zoom out, route draw, camera follow.
- Route line animate tu diem A den B, khong hien ngay lap tuc.
- Moi stop nen co visual landmark rieng.
- Dung 3D object cho landmark de tao "wow moment".
- Can giu focus vao diem chinh khi zoom/pan, tranh camera bay vo huong.

Mau prompt:

```text
Create a map composition. Start focused on [origin], zoom out while keeping it centered, then draw an animated route to [destination] while the camera follows the line. Add [next stop] and reveal a 3D landmark there with subtle rotation and lighting.
```

## Nguyen Tac Chung De Prompt Remotion Dep Hon

### Thong so nen co trong moi prompt

- Ten composition.
- Resolution: vi du 1920x1080, 1080x700, 1080x1920.
- FPS: thuong la 30fps.
- Thoi luong hoac frame count.
- Asset paths: logo, anh, audio, font.
- Palette mau.
- Font.
- Scene list voi duration.
- Animation style: spring, interpolation, stagger, fade, scale, rotate, blur.
- Yeu cau verification: preview/screenshot/render frame neu can.

### Chuyen dong nen uu tien

- Spring cho UI vao/ra.
- Interpolate cho camera, opacity, blur, color.
- Stagger cho list/cards.
- Stroke drawing cho line, route, chart.
- Low-frequency audio reactivity cho clip co nhac.
- Slow zoom/rotate 3D cho anh tinh hoac article.

### Nhung chi tiet lam clip trong "premium" hon

- Mot y chinh moi scene.
- Motion nhe nhung lien tuc.
- Background co depth: grid, glow nhe, gradient co kiem soat.
- Text ngan, co hierarchy ro.
- Transition co logic mau/chuyen dong giua scenes.
- Asset that neu co: logo, screenshot, website, map, product UI.
- CTA cuoi cuc ngan va de nho.

### Nhung loi prompt nen tranh

- Khong ghi resolution/fps/duration.
- Nhieu y trong mot scene.
- Yeu cau animation "dep" nhung khong noi dep theo kieu nao.
- Cat canh dot ngot giua cac background mau khac nhau.
- Cho audio reactive qua manh lam moi thu rung lac.
- Highlight nam tren text lam kho doc.
- Data visualization thieu nhan truc, thieu don vi, thieu timing.

## Template Prompt Tong Hop

```text
Use Remotion best practices. Create a composition called [Name], [resolution], [fps]fps, [duration].

Style:
- Background: [color/gradient/theme]
- Accent: [accent color]
- Fonts: [fonts]
- Motion: [spring/interpolate/stagger/audio-reactive/etc.]

Assets:
- Logo: [path]
- Images/video/audio: [paths]

Scenes:
1. [Scene name] - [duration frames/seconds]
   [What appears, text, motion, transition]
2. [Scene name] - [duration]
   [What appears, text, motion, transition]
3. [Scene name] - [duration]
   [What appears, text, motion, transition]

Transitions:
- Use smooth fade + scale or color interpolation between sections.
- Keep motion subtle and premium.

Implementation:
- Check existing lockfiles and use the correct package manager before installing dependencies.
- Reuse existing components and follow Remotion best practices.
- Verify visually with preview frames/screenshots.
```
