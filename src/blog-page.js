import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/components/mobile-nav.css";
import "../styles/components/blog.css";
import "../styles/components/blog-page.css";
import "../styles/utils.css";

import mobileNav from "./utils/mobile-nav";
import initParticles from "./utils/particles";
import blogs, { formatDate } from "./data/blogs.js";

// Initialize mobile nav
mobileNav();

// Initialize particles
const initParticleSystem = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    initParticles();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initParticleSystem);
} else {
  initParticleSystem();
}

// Category icons
const categoryIcons = {
  learning: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>`,
  project: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/></svg>`,
  tutorial: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
  thoughts: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>`,
};

// Create blog card
const createBlogCard = (blog, index) => {
  const card = document.createElement("article");
  card.className = "blog-card blog-card--page";
  card.setAttribute("data-category", blog.category);
  card.style.animationDelay = `${index * 0.1}s`;

  const hasRealLink = blog.link && blog.link !== "#";

  card.innerHTML = `
    <div class="blog-card__header">
      <span class="blog-card__category blog-card__category--${blog.category}">
        ${categoryIcons[blog.category]}
        ${blog.category}
      </span>
      ${hasRealLink ? `<span class="blog-card__date">${formatDate(blog.date)}</span>` : ''}
    </div>
    <h3 class="blog-card__title">${blog.title}</h3>
    <p class="blog-card__excerpt">${blog.excerpt}</p>
    <div class="blog-card__footer">
      <div class="blog-card__tags">
        ${blog.tags
          .slice(0, 3)
          .map((tag) => `<span class="blog-card__tag">${tag}</span>`)
          .join("")}
      </div>
      <div class="blog-card__meta">
        <span class="blog-card__read-time">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          ${blog.readTime}
        </span>
        ${
          hasRealLink
            ? `<a href="${blog.link}" class="blog-card__link" aria-label="Read more about ${blog.title}">
          Read More
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </a>`
            : `<span class="blog-card__link blog-card__link--coming-soon" aria-label="Coming soon">
          Coming Soon
        </span>`
        }
      </div>
    </div>
  `;

  // Mouse tracking glow
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });

  return card;
};

// Render blogs
const renderBlogs = (blogsToRender) => {
  const grid = document.getElementById("blog-grid");
  const emptyState = document.getElementById("blog-empty");

  grid.innerHTML = "";

  if (blogsToRender.length === 0) {
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";

  blogsToRender.forEach((blog, index) => {
    const card = createBlogCard(blog, index);
    grid.appendChild(card);
  });
};

// Update stats
const updateStats = () => {
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags))];
  document.getElementById("total-posts").textContent = blogs.length;
  document.getElementById("total-tags").textContent = allTags.length;
};

// Filter and search state
let currentFilter = "all";
let currentSearch = "";

// Apply filters
const applyFilters = () => {
  let filtered = [...blogs];

  // Apply category filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((blog) => blog.category === currentFilter);
  }

  // Apply search
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  renderBlogs(filtered);
};

// Initialize filters
const initFilters = () => {
  const filterBtns = document.querySelectorAll(".blog__filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });
};

// Initialize search
const initSearch = () => {
  const searchInput = document.getElementById("blog-search");
  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentSearch = e.target.value.trim();
      applyFilters();
    }, 300);
  });
};

// Clear filters
const initClearFilters = () => {
  const clearBtn = document.getElementById("clear-filters");
  clearBtn.addEventListener("click", () => {
    currentFilter = "all";
    currentSearch = "";
    document.getElementById("blog-search").value = "";
    document
      .querySelectorAll(".blog__filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector('.blog__filter-btn[data-filter="all"]')
      .classList.add("active");
    applyFilters();
  });
};

// Header scroll effect
const header = document.querySelector(".header");
let ticking = false;

const updateHeader = () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true },
);

// Initialize everything
updateStats();
initFilters();
initSearch();
initClearFilters();
applyFilters();
