/**
 * Optimized 3D Particle System
 * Lightweight, GPU-friendly particle animation with mouse interactivity
 */

class Particle {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * 1000;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = options.size || 2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.speedZ = (Math.random() - 0.5) * 2;
    this.color = options.color || "#4f46e5";
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update(mouse, mouseRadius) {
    // 3D movement
    this.z += this.speedZ;
    if (this.z < 1) this.z = 1000;
    if (this.z > 1000) this.z = 1;

    // Calculate 3D projection
    const perspective = 800;
    const scale = perspective / (perspective + this.z);

    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse interaction with smooth easing
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }
    }

    // Boundary wrapping
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;

    return scale;
  }

  draw(ctx, scale) {
    const projectedSize = this.size * scale;
    const projectedOpacity = this.opacity * scale;

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(projectedSize, 0.5), 0, Math.PI * 2);
    ctx.fillStyle = this.color
      .replace(")", `, ${projectedOpacity})`)
      .replace("rgb", "rgba");
    ctx.fill();
  }
}

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.mouseRadius = options.mouseRadius || 150;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.fps = 60;
    this.fpsInterval = 1000 / this.fps;

    this.options = {
      particleCount: options.particleCount || 80,
      color: options.color || "rgb(79, 70, 229)",
      connectionDistance: options.connectionDistance || 120,
      connectionColor: options.connectionColor || "rgba(79, 70, 229,",
      size: options.size || 2,
      ...options,
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.start();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
  }

  createParticles() {
    this.particles = [];
    // Reduce particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile
      ? Math.floor(this.options.particleCount / 2)
      : this.options.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push(
        new Particle(this.canvas, {
          color: this.options.color,
          size: this.options.size,
        }),
      );
    }
  }

  addEventListeners() {
    // Throttled resize
    let resizeTimeout;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 250);
      },
      { passive: true },
    );

    // Mouse tracking with throttle
    let lastMouseMove = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        const now = Date.now();
        if (now - lastMouseMove < 16) return; // ~60fps throttle
        lastMouseMove = now;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      },
      { passive: true },
    );

    window.addEventListener(
      "mouseleave",
      () => {
        this.mouse.x = null;
        this.mouse.y = null;
      },
      { passive: true },
    );

    // Touch support
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches[0]) {
          this.mouse.x = e.touches[0].clientX;
          this.mouse.y = e.touches[0].clientY;
        }
      },
      { passive: true },
    );

    window.addEventListener(
      "touchend",
      () => {
        this.mouse.x = null;
        this.mouse.y = null;
      },
      { passive: true },
    );

    // Visibility API - pause when hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  drawConnections() {
    const maxDistance = this.options.connectionDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `${this.options.connectionColor}${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate(currentTime) {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame((time) => this.animate(time));

    // FPS limiting for consistent performance
    const elapsed = currentTime - this.lastTime;
    if (elapsed < this.fpsInterval) return;
    this.lastTime = currentTime - (elapsed % this.fpsInterval);

    // Clear with slight trail effect
    this.ctx.fillStyle = "rgba(7, 10, 19, 0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      const scale = particle.update(this.mouse, this.mouseRadius);
      particle.draw(this.ctx, scale);
    });

    // Draw connections
    this.drawConnections();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  updateColors(isDark) {
    const color = isDark ? "rgb(79, 70, 229)" : "rgb(99, 102, 241)";
    const connectionColor = isDark ? "rgba(79, 70, 229," : "rgba(99, 102, 241,";

    this.options.color = color;
    this.options.connectionColor = connectionColor;

    this.particles.forEach((particle) => {
      particle.color = color;
    });
  }
}

export default function initParticles() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    console.log("Reduced motion preferred, particles disabled");
    return null;
  }

  return new ParticleSystem("particles-canvas", {
    particleCount: 100,
    connectionDistance: 150,
    mouseRadius: 180,
    size: 2.5,
  });
}

export { ParticleSystem };
