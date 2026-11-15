/* ============================================================
   main.js – shared across every page
   1. Mobile menu toggle
   2. Fade-up animation when sections scroll into view
   3. Skill bar fill animation (About page)
   4. Project filter buttons (Projects page)
   ============================================================ */

/* ---------- 1. Mobile menu toggle ---------- */
var navToggle = document.getElementById('navToggle');
var navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    // Adds/removes the .open class, which shows/hides the menu (see CSS)
    navLinks.classList.toggle('open');
  });
}

/* ---------- 2. Fade-up sections on scroll ---------- */
/* IntersectionObserver watches elements and tells us when they
   enter the screen. We then add .visible to trigger the CSS animation. */
var fadeEls = document.querySelectorAll('.fade-up');

var fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(function (el) {
  fadeObserver.observe(el);
});

/* ---------- 3. Skill bars (About page) ---------- */
/* Each bar starts at width 0. When it scrolls into view we set its
   real width (stored in the data-width attribute) so it animates. */
var skillFills = document.querySelectorAll('.skill-fill');

if (skillFills.length > 0) {
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(function (bar) {
    skillObserver.observe(bar);
  });
}

/* ---------- 4. Project filters (Projects page) ---------- */
var filterBar = document.getElementById('filterBar');

if (filterBar) {
  var filterButtons = filterBar.querySelectorAll('.filter-btn');
  var projects = document.querySelectorAll('.big-project');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Highlight the clicked button
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');

      // Show cards that match the chosen category, hide the rest
      var chosen = button.dataset.filter;
      projects.forEach(function (project) {
        if (chosen === 'all' || project.dataset.category === chosen) {
          project.classList.remove('hidden');
        } else {
          project.classList.add('hidden');
        }
      });
    });
  });
}
