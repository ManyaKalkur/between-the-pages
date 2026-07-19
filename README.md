# Between the Pages

> A cinematic book discovery platform. Every book is a world, step inside.

## What is this?

**Between the Pages** is a full-stack MERN web app for readers who want more than a list of titles and star ratings. Every book on the platform gets its own atmosphere: AI summaries, curated Spotify playlists, Pinterest moodboards, reader reviews, and for the most iconic books, a full cinematic 30-second experience that puts you inside the world before you open the first page.

---

## Live Demo

🔗 **[between-the-pages.vercel.app](https://between-the-pages-an-experience.vercel.app)**

---

## Features built so far

- Cinematic Book Intro
- Welcome Page
- Auth Pages
- Browse Page (Live search powered by **Google Books API** )
- Book Detail Page
- Cinematic Experience Page
- About Page
---

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Animation | Framer Motion |
| Styling | Plain CSS (component-scoped, no framework) |
| Book data | Google Books API |
| Deployment | Vercel |

---

## Folder structure

```
between-the-pages/
├── images/
│   |── bookmark.jpg
│   └── icon.jpg
├── src/
│   ├── components/
│   │   ├── BookCard.jsx / .css
│   │   ├── BookCover.jsx / .css 
│   │   ├── FilterBar.jsx / .css
│   │   ├── Navbar.jsx / .css
│   │   └── Pagination.jsx / .css
│   ├── pages/
│   │   ├── AboutPage.jsx / .css
│   │   ├── BookDetailPage.jsx / .css
│   │   ├── BrowsePage.jsx / .css
│   │   ├── ExperiencePage.jsx / .css
│   │   ├── LoginPage.jsx / .css
│   │   ├── RegisterPage.jsx / .css
│   │   └── WelcomePage.jsx / .css
│   ├── styles/
│   │   ├── auth.css
│   │   ├── global.css
│   ├── App.jsx 
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting started locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/between-the-pages.git
cd between-the-pages/client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add environment variables
```bash
cp .env.example .env
```
Then open .env and add your Google Books API key:
VITE_GOOGLE_BOOKS_API_KEY=your_key_here

### 4. Start dev server
```bash
npm run dev
```
### 5. Open in browser
```bash
http://localhost:5173
```

---

## What's coming next

- [ ] **Backend**: Node.js + Express + MongoDB Atlas on Railway
- [ ] **Auth**: JWT + Google OAuth
- [ ] **Bookshelves**: custom user-created shelves
- [ ] **Reading Progress**: Strava-style session logging, streaks, weekly goals, stats dashboard
- [ ] **Reviews**: persisted to DB, liked by other users
- [ ] **User links**: attach your own Spotify playlists and Pinterest boards to any book
- [ ] **Book suggestions**: users request books, admin approves
- [ ] **Admin dashboard**: manage books, flag Famous, approve suggestions, promote users
- [ ] **AI Summaries**: Gemini Flash integration
- [ ] **More experiences**

<p align="center">Built for readers who feel. 📖</p>
