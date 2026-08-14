# Purelane Homepage — Shopify Theme Technical Submission Notes

---

## 1. Store & Deliverable Overview

- **Target Theme**: Stock Dawn Theme (Shopify)
- **Architecture**: 13 Production-Ready Merchant-Editable Liquid Sections
- **Live Dev Store URL**: `https://purelane-dev-dwkavtxz.myshopify.com`
- **Live Local Preview**: `http://127.0.0.1:9292/` (via `shopify theme dev`)

---

## 2. Metafield & Metaobject Definitions (Deliverable 3)

To ensure the marketing team can manage custom product data dynamically through the Shopify Admin without touching code, the following Metafield definitions are configured. For full detailed specifications, setup steps, and GraphQL import schema, see [METAFIELDS.md](file:///c:/Users/user/Desktop/shopify-theme/METAFIELDS.md).

### Product Metafields (`product.metafields.purelane.*`)
1. `purelane.subtitle` (Single line text)
   - *Usage*: Renders secondary product description or subtitle on cards and combo preview strips (e.g., "Foaming kitchen cleaner").
2. `purelane.badge_text` (Single line text)
   - *Usage*: Custom badge pill text rendered on product cards (e.g., "Best Seller", "Save 33%").
3. `purelane.combo_savings` (Single line text)
   - *Usage*: Displays discount badge on Best-Selling Combos (e.g., "Save ₹398").
4. `purelane.bottle_type` (Single line text / Enum)
   - *Usage*: Maps product to SVG bottle Data URI preview (`kbtl`, `tbtl`, `mbtl`, `dish`, `toilet`, `floor`, etc.) if custom product imagery is omitted.

---

## 3. Notes on the Build (Deliverable 4)

### Flags About the Original Prototype File (`purelane-homepage.html`)
- **Monolithic 148KB Single-File Prototype**: All HTML, CSS, JavaScript, and base64 SVG assets were bundled into one unorganized document without modularity.
- **Hardcoded Data & SVG Data URIs**: Static prices, product titles, and inline Data URIs were hardcoded directly in DOM nodes rather than driven by a platform data schema.
- **Non-Standard Relative Positioning**: Scroll observers used single-level `.offsetTop` logic which breaks inside nested production theme section wrappers (`div.shopify-section`).
- **Accessibility & Keyboard Focus Gaps**: Interactive dot controls and card CTAs lacked focus indicators and ARIA state labels.

### What Was Changed & Technical Rationale
- **Modular Liquid Architecture**: Converted the prototype into 13 standalone Liquid sections (`sections/purelane-hero.liquid`, `purelane-shop.liquid`, `purelane-combos.liquid`, `purelane-bundles.liquid`, `purelane-reviews.liquid`, etc.) registered in `templates/index.json`.
- **Merchant-Editable Schema Systems**: Added rich JSON schema definitions (`settings`, `blocks`, `presets`) to every section so marketing teams can customize headlines, subtext, button labels, badge text, and prices directly in the Shopify Theme Editor.
- **CSS Design System (`assets/purelane.css`)**: Extracted all CSS variables (`--ink`, `--paper`, `--surface`, `--accent`), glassmorphic panels (`.glass`, `.glass-2`), responsive flex layouts (`.hs1`, `.hs2`, `.hs3`), and background water canvas styling (`.scenes`).
- **JavaScript Engine (`assets/purelane.js`)**:
  - Implemented cumulative offset tracking (`getAbsoluteTop()`) in `syncRail()` so the floating side progress rail updates accurately regardless of nested `div.shopify-section` wrappers.
  - Built hero stage product rotator with 3-tier slide flex scaling.
  - Implemented continuous auto-marquee review track.
  - Added Shopify Theme Editor event integration (`shopify:section:load`) so section updates re-initialize animations cleanly without page reloads.
- **Responsive Alignment**: Pixel-matched prototype layout from 375px mobile viewports up to 1920px desktop viewports.

### What I'd Do With More Time
- **Custom Metaobjects for Bundles & Combos**: Build a custom Shopify Metaobject schema allowing merchants to visually construct multi-item bundle tiers directly from Shopify Admin.
- **Shopify Native Image Picker & `srcset` Optimization**: Replace SVG Data URIs with Shopify `image_picker` settings featuring automated WEBP compression and responsive `srcset` output.
- **Shopify Ajax Cart Drawer Integration**: Wire custom "Buy 3 for ₹499" tier pricing logic directly into Shopify's Ajax Cart Drawer API and discount scripts.
- **Automated Core Web Vitals Audit**: Implement automated Lighthouse CI performance testing to ensure sub-second LCP and zero CLS across mobile devices.

---

## 4. Short Notes on AI Workflow (Deliverable 5)

### What Was Delegated
- **Boilerplate Liquification**: Converting prototype HTML structural components into clean Shopify Liquid template files.
- **CSS Design Token Extraction**: Mapping prototype CSS root variables into `assets/purelane.css`.
- **Flex Order & Height Logic**: Generating responsive CSS rules (`order: 1`, `order: 2`, `order: 3`) for the 3-bottle hero stage cluster.
- **Schema Preset Boilerplate**: Generating initial JSON schema block structures for Shopify Theme Editor compatibility.

### Where AI Failed & Required Human Correction
- **Nested Wrapper Offset Logic**: AI initially generated naive `.offsetTop` scroll position logic for `syncRail()`, which broke inside Shopify's nested `div.shopify-section` containers until updated to cumulative parent offset tracking (`getAbsoluteTop()`).
- **Theme Color Context Alignment**: Initial automated CSS translation required visual inspection to ensure the light mint green water background (V2) was rendered with exact precision against heading contrast requirements.

### What I'd Systematise for 20+ Store Builds
- **Automated HTML-to-Liquid Section CLI**: Build a Node.js AST parser tool that ingests raw HTML prototype files, extracts sections, and automatically generates valid Liquid files with schema JSON presets.
- **Shopify Design Token Bridge**: Create a CLI script mapping CSS `:root` tokens directly to Shopify `settings_schema.json` for instant design system integration.
- **Playwright Visual & E2E Testing Suite**: Establish automated visual regression tests covering 375px, 768px, 1024px, and 1440px viewports to verify zero layout drift across section updates.
