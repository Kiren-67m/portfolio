# Qiming Liu — 3D Portfolio

[Visit the portfolio](https://kiren-67m.github.io/portfolio/)

This branch contains the Vite, React, and TypeScript source for the 3D portfolio. It uses Three.js and GSAP for the interactive home page, and includes project case studies, experience, and a portfolio chat.

## Preview and build

```sh
npm ci
npm run dev
npm run build -- --base=/portfolio/
npm run preview -- --base=/portfolio/
```

GitHub Pages serves the compiled site from the root of the `main` branch. Copy the build output over `main` when publishing a new version. Keep the existing résumé PDF and publicly linked media at their original paths. The HTML files in `public/` forward older portfolio links to their current sections.

This site adapts [Moncy Yohannan’s 2025 portfolio template](https://github.com/MoncyDev/Portfolio-Website/tree/be3da254d7f81541885fae10311c258fe73b49a8). That revision was released under the [MIT License](LICENSE).
