import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/components/mobile-nav.css";
import "../styles/components/blog-post.css";
import "../styles/utils.css";

import mobileNav from "./utils/mobile-nav";
import initParticles from "./utils/particles";

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

// Reading progress indicator
const createProgressBar = () => {
  const progress = document.createElement("div");
  progress.className = "blog-post__progress";
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = `${scrollPercent}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
};

createProgressBar();
