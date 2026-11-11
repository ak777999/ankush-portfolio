ANKUSH PORTFOLIO — README (Hinglish)
====================================

Ye ek simple HTML/CSS/JS website hai. Koi install nahi chahiye, internet ke bina bhi chalti hai
(fonts aur GSAP animation library assets/ folder ke andar hi hain).

1) WEBSITE KAISE KHOLEIN
------------------------
Tareeka A (best, localhost):
   - Is folder (AnkushPortfolio) mein terminal / CMD kholo
   - Chalao:   python -m http.server 8080
     (Mac/Linux par: python3 -m http.server 8080)
   - Browser mein kholo:  http://localhost:8080
Tareeka B (seedha):
   - index.html par double-click karo. Ye bhi chalta hai (Chrome/Edge mein test kiya).

2) NAAM, ROLES, EMAIL, STATS, PROJECTS KAISE BADLEIN
----------------------------------------------------
SAARA text ek hi file mein hai:   assets/content.js
Notepad / VS Code se kholo, sirf "..." quotes ke andar ka text badlo, save karo, browser refresh karo.

   name        -> naam (signature + footer + train engine par)
   logo        -> hero ka bada script logo ("ankush")
   tag         -> top-left "ANKUSH 07 / PORTFOLIO"
   status      -> "Available for freelance work"
   loader      -> loading screen ke words
   roles       -> hero ke left side: Designer / Creator / Creative Director
   sticker     -> peeli sticker par ghoomta text
   about.statement -> bada black statement. <mark>word</mark> = peela highlight, <b>word</b> = blue highlight
   about.note  -> chhoti line (abhi "PLACEHOLDER STORY" likha hai — hata dena)
   projectsSheet.stats -> 50+ Projects, 4+ Years, 20+ Clients, 100% Chai (apne asli numbers daalo)
   train.projects -> train ki 5 khidkiyon wale projects: title, type, year, img, link
   contact.email  -> abhi "ankush@example.com" hai — ASLI EMAIL DAALNA MAT BHOOLNA
   contact.socials -> Instagram / Behance / LinkedIn ke links (abhi "#" hain)

   Project add/remove karna hai? train.projects list mein ek { ... } block copy/paste ya delete karo.
   Train apne aap utne hi coaches bana degi.

3) PHOTOS KAISE BADLEIN
-----------------------
   - About photo: apni photo ko assets/img/ mein daalo (jaise ankush.jpg) aur content.js mein
     about.photo: "assets/img/ankush.jpg" likh do. Portrait (3:4) photo best lagegi.
     Abhi wahan ek AI illustration placeholder hai (asli insaan nahi).
   - Project thumbnails: assets/img/ mein apni images (jpg/png/webp, 800x560 jaisa ratio) daalo aur
     har project ki img: "assets/img/meri-file.jpg" kar do. Abhi wahan simple SVG placeholders hain.

4) COLOURS / FONTS
------------------
   assets/style.css ke top par :root mein:
   --blue:#1133FF  --yellow:#FFD700  --off:#F5F5F5   (yahan colour badlo, poori site badal jayegi)
   Fonts: Inter (headings), Knewave (script logo), Caveat Brush (handwritten), Hind (Hindi). Sab OFL free fonts.

5) FOLDER
---------
   index.html            -> page ka structure
   assets/content.js     -> SAARA editable text (sirf isko badlo)
   assets/style.css      -> design
   assets/app.js         -> animations (loader, zoom, train, nav circle)
   assets/vendor/        -> GSAP + ScrollTrigger (offline copy)
   assets/fonts/         -> fonts (offline)
   assets/img/           -> photo + project thumbnails

Note: Ye design ek Instagram reel wale portfolio se inspired hai, lekin saara text aur artwork naya/original hai.
