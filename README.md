# Student Portfolio & Academic Management Website

My term project for **COS 106 – Introduction to Web Technologies** at MIVA Open University.
A responsive, multi-page portfolio and academic planner built with plain **HTML, CSS and JavaScript** — no frameworks, no libraries.

## Live site

- **Live link:** https://dgoldesign.github.io/Cos-106-project/
- **Repository:** https://github.com/dgoldesign/Cos-106-project

## Pages

| Page | File | What's on it |
|------|------|--------------|
| Home | `index.html` | Hero with my name and photo, brief biography, stat cards, featured projects |
| About | `about.html` | Intro video, education table, career aspirations, animated skill bars, hobbies |
| Projects | `projects.html` | Filterable project cards (JavaScript), deliverables, tools, summary table |
| Planner | `planner.html` | Interactive task manager: add, complete and delete tasks, live progress summary |
| Contact | `contact.html` | Contact form with full JavaScript validation and a success message |

## Features

- One shared external stylesheet (`css/style.css`) with CSS variables for the colour scheme
- Responsive layout with Flexbox and CSS Grid (breakpoints at 1024px, 768px and 480px)
- Mobile hamburger menu toggled with JavaScript
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<table>`, `<form>`, `<video>`
- Academic planner stores tasks in `localStorage` as an array of objects, so they survive refreshes
- Project filtering with `data-category` attributes
- Form validation with regular expressions (required fields, email format, digits-only phone)
- Animations: fade-up sections on scroll, skill bar fill, hover lifts, task add/remove fades

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, custom properties, transitions)
- Vanilla JavaScript (DOM manipulation, events, localStorage, IntersectionObserver)
- Google Fonts – Plus Jakarta Sans

## Run it locally

1. Download or clone this folder.
2. Open `index.html` in any browser — no build step or server needed.
3. (Optional) Drop a short video named `intro.mp4` into the `media/` folder for the About page.

## Folder structure

```
index.html        Home
about.html        About me
projects.html     Projects
planner.html      Academic planner
contact.html      Contact form
css/style.css     One stylesheet for every page
js/main.js        Menu toggle, scroll animations, project filters
js/planner.js     Task manager (array of objects + localStorage)
js/contact.js     Form validation
images/           Photo and project images
media/            intro.mp4 (About page video)
```

---

© 2026 NobleGold Chiekezie Akachukwu · MIVA Open University
