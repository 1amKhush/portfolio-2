// Page transitions and loading animations
const initPageTransitions = () => {
  // Create loading overlay
  const overlay = document.createElement("div");
  overlay.className = "page-loader";
  overlay.innerHTML = `
    <div class="page-loader__content">
      <div class="page-loader__logo">K</div>
      <div class="page-loader__spinner"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Hide loader after page loads
  const hideLoader = () => {
    overlay.classList.add("page-loader--hidden");
    document.body.classList.add("page-loaded");

    // Remove overlay after animation
    setTimeout(() => {
      overlay.style.display = "none";
    }, 600);
  };

  // Show loader on initial load
  if (document.readyState === "complete") {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 300);
    });
  }

  // Handle internal link clicks with smooth transition
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href");

    // Only handle internal HTML page links (not anchors or external)
    if (
      href &&
      href.endsWith(".html") &&
      !href.startsWith("http") &&
      !href.startsWith("mailto")
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetUrl = href;

        // Show loader
        overlay.style.display = "flex";
        overlay.classList.remove("page-loader--hidden");
        document.body.classList.remove("page-loaded");

        // Navigate after animation
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 400);
      });
    }
  });

  // Handle browser back/forward with bfcache
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      hideLoader();
    }
  });
};

// Smooth scroll for anchor links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
};

// Intersection Observer for scroll animations
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Auto-add animation to common elements
  const animatableSelectors = [
    ".blog-card",
    ".blog-post__content h2",
    ".blog-post__content h3",
    ".blog-post__cta",
    ".blog-hero__content",
    ".blog-stats__item",
    ".channel-diagram",
  ];

  animatableSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.05}s`;
      el.classList.add("animate-on-scroll");
      observer.observe(el);
    });
  });
};

// Premium cursor effect (optional, for desktop)
const initCursorEffect = () => {
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    const animateCursor = () => {
      const dx = cursorX - currentX;
      const dy = cursorY - currentY;

      currentX += dx * 0.15;
      currentY += dy * 0.15;

      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Grow cursor on interactive elements
    document.querySelectorAll("a, button, .blog-card").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("custom-cursor--hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("custom-cursor--hover");
      });
    });
  }
};

// Initialize all premium features
export const initPremiumFeatures = () => {
  initPageTransitions();
  initSmoothScroll();
  initScrollAnimations();
  // Uncomment for custom cursor (optional):
  // initCursorEffect();
};

export default initPremiumFeatures;
