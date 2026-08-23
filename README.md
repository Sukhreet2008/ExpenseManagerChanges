# Expense Manager

A simple personal finance web app built with **React + Vite (JavaScript only)**.
Track income and expenses, view your balance on a dashboard, search/filter/sort
transactions, and see basic spending analytics — all stored in the browser's
Local Storage (no backend required).

## Tech Stack

- React (functional components + hooks: `useState`, `useEffect`)
- Vite
- Plain CSS (no Tailwind, no UI library)
- Browser `localStorage` for persistence

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     Reusable UI pieces (Navbar, StatCard, TransactionForm, ...)
├── pages/          Dashboard, Transactions, Analytics, Settings, NotFound
├── utils/
│   ├── storage.js  Local Storage read/write helpers
│   └── helpers.js  Categories + formatting helpers
├── App.jsx         Main app state + simple page switching
├── main.jsx        React entry point
└── style.css       All styling (light + dark mode via CSS variables)
```

## Features

- Add / edit / delete transactions with validation
- Search by title, filter by type/category/date/amount range
- Sort by date, amount, or title
- Dashboard with totals, recent transactions, category & monthly charts
- Analytics page: category breakdown, monthly expense, income vs expense,
  weekly spending, monthly trend table
- Light / dark mode (saved in Local Storage)
- Settings page to switch theme or clear all data
- Empty states and a 404 page
- Fully responsive (desktop, tablet, mobile)

No backend, no TypeScript, no external state-management or chart libraries —
just plain React and CSS, kept simple and easy to explain.
