// assets/pln-sections.js
const PLN = { inits: {}, teardowns: {} };

// 1. Run when a section is loaded in the Theme Editor
document.addEventListener('shopify:section:load', (e) => {
  const wrapper = e.target.querySelector('[data-pln-section]');
  if (!wrapper) return;
  const type = wrapper.dataset.plnSection;
  if (PLN.inits[type]) PLN.inits[type](wrapper);
});

// 2. Run when a section is removed/re-rendered in the Theme Editor
document.addEventListener('shopify:section:unload', (e) => {
  const wrapper = e.target.querySelector('[data-pln-section]');
  if (!wrapper) return;
  const type = wrapper.dataset.plnSection;
  if (PLN.teardowns[type]) PLN.teardowns[type](wrapper);
});

// 3. Run on initial page load for all sections on the frontend
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-pln-section]').forEach(el => {
    const type = el.dataset.plnSection;
    if (PLN.inits[type]) PLN.inits[type](el);
  });
});