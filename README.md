# AGIPOCKET Wallet Site

Official landing site for **AGIPOCKET** in this repository, built with **React + TypeScript + Vite**.

The page is aligned to the `agent-pocket/` project structure, while using Solcraft brand colors (deep blue + cyan + orange) and `logo.png` as the core visual asset.

## Key Features

- Animated initialization loading screen
- Hero section with primary actions:
  - `Download Extension`
  - `I am agent (skill.md)`
- Social links:
  - GitHub: `https://github.com/solcrafts`
  - Twitter/X: `https://x.com/aisolcraft`
- i18n support:
  - `English`
  - `简体中文`
  - `繁體中文`
- Default language: `English`

## Tech Stack

- React 19
- TypeScript
- Vite
- i18next + react-i18next + language detector

## Project Structure

- `src/App.tsx`: Main page structure and interactions
- `src/App.css`: Full visual styling and animations
- `src/i18n.ts`: i18n initialization and language detection
- `src/locales/en.json`: English copy
- `src/locales/zh-CN.json`: Simplified Chinese copy
- `src/locales/zh-TW.json`: Traditional Chinese copy
- `public/logo.png`: Brand logo used in loading and hero
- `summary.md`: Product understanding notes for AGIPOCKET

## Run Locally

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Notes

- This site intentionally does **not** use `banner.png`.
- Visual style is kept consistent with the main Solcraft web identity.
