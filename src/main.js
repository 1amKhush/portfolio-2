import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/header.css";
import "../styles/components/hero.css";
import "../styles/components/about.css";
import "../styles/components/featured.css";
import "../styles/components/work.css";
import "../styles/components/contact.css";
import "../styles/components/footer.css";
import "../styles/components/mobile-nav.css";
import "../styles/components/blog.css";
import "../styles/components/transitions.css";
import "../styles/utils.css";

import mobileNav from "./utils/mobile-nav";
import darkMode, { setParticleSystem } from "./utils/dark-mode";
import lazyLoading from "./utils/lazy-loading";
import initParticles from "./utils/particles";
import initBlogs from "./utils/blog-renderer";
import initPremiumFeatures from "./utils/page-transitions";

// Initialize premium features (loading, transitions, scroll effects)
initPremiumFeatures();

// Initialize features
mobileNav();
darkMode();
lazyLoading();
initBlogs();

// Initialize 3D particles with performance check
let particleSystem = null;

// Only initialize particles on non-mobile or high-performance devices
const initParticleSystem = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    particleSystem = initParticles();
    // Set reference for dark mode updates
    if (particleSystem) {
      setParticleSystem(particleSystem);
    }
  }
};

// Initialize particles after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initParticleSystem);
} else {
  initParticleSystem();
}

// Header scroll effect
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;
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
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true },
);

// Smooth reveal animations using Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const revealCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(
  revealCallback,
  observerOptions,
);

// Observe sections for reveal animation
document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  revealObserver.observe(section);
});

// Export particle system for theme updates
export { particleSystem };
