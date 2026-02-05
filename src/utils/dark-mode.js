// Dark mode is the default and only theme
// This file is kept for potential future theme extensions

const darkMode = () => {
  // Remove any stored light mode preference
  localStorage.removeItem("theme");
  document.body.classList.remove("light-mode");
};

export default darkMode;

// Empty export for compatibility with main.js
export const setParticleSystem = () => {};
