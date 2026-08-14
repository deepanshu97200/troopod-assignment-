# Purelane Custom Product Metafield Definitions

This document outlines the custom product metafield definitions configured for the **Purelane Shopify Theme**. These definitions allow merchant store managers to dynamically manage product subtitles, badges, savings callouts, and bottle visual representations via the Shopify Admin (`Settings > Custom Data > Products`) without editing code.

---

## 1. Metafield Definitions Summary Table

| Field Name | Namespace & Key | Type | Description | Example Values |
| :--- | :--- | :--- | :--- | :--- |
| **Product Subtitle** | `purelane.subtitle` | `single_line_text_field` | Secondary descriptive text rendered on product cards, combo preview strips, and grid listings. | `"Foaming kitchen cleaner"`, `"Plant-based floor cleaner"` |
| **Badge Text** | `purelane.badge_text` | `single_line_text_field` | Highlight badge pill text rendered overlaying product cards. | `"Best Seller"`, `"New Formula"`, `"Save 33%"` |
| **Combo Savings** | `purelane.combo_savings` | `single_line_text_field` | Savings callout text specifically displayed on Best-Selling Combo product bundles. | `"Save ₹398"`, `"Save 25%"` |
| **Bottle Type Key** | `purelane.bottle_type` | `single_line_text_field` | Identifier mapping the product to custom Data URI / SVG bottle preview illustrations when product photos are absent. | `"kbtl"`, `"tbtl"`, `"mbtl"`, `"dish"`, `"toilet"`, `"floor"` |

---

## 2. Detailed Technical Specifications

### 1. `purelane.subtitle`
- **Name**: Product Subtitle
- **Namespace & Key**: `purelane.subtitle`
- **Type**: Single line text (`single_line_text_field`)
- **Access Permissions**: Merchant read/write, Storefront API access enabled
- **Liquid Usage**: `{{ product.metafields.purelane.subtitle.value | default: product.description }}`

### 2. `purelane.badge_text`
- **Name**: Badge Text
- **Namespace & Key**: `purelane.badge_text`
- **Type**: Single line text (`single_line_text_field`)
- **Access Permissions**: Merchant read/write, Storefront API access enabled
- **Liquid Usage**: `{% if product.metafields.purelane.badge_text != blank %}<span class="card-badge">{{ product.metafields.purelane.badge_text.value }}</span>{% endif %}`

### 3. `purelane.combo_savings`
- **Name**: Combo Savings Text
- **Namespace & Key**: `purelane.combo_savings`
- **Type**: Single line text (`single_line_text_field`)
- **Access Permissions**: Merchant read/write, Storefront API access enabled
- **Liquid Usage**: `{{ product.metafields.purelane.combo_savings.value }}`

### 4. `purelane.bottle_type`
- **Name**: Bottle Type Key
- **Namespace & Key**: `purelane.bottle_type`
- **Type**: Single line text (`single_line_text_field`)
- **Accepted Values**: `kbtl` | `tbtl` | `mbtl` | `dish` | `toilet` | `floor`
- **Liquid Usage**: Used to conditionally select fallback vector graphics in `snippets/` or `sections/purelane-hero.liquid`.

---

## 3. Shopify Admin Setup Instructions

To recreate these metafield definitions in any Shopify store:

1. Log into your **Shopify Admin**.
2. Navigate to **Settings** $\rightarrow$ **Custom data** $\rightarrow$ **Products**.
3. Click **Add definition**.
4. Enter the **Name** and **Namespace and key** as specified in the table above.
5. Select the **Type** (`Single line text`).
6. Enable **Storefronts** under Access options (enables Liquid & Storefront API read access).
7. Click **Save**.

---

## 4. GraphQL Admin API Import JSON Schema

If creating via Shopify GraphQL Admin API (`metafieldDefinitionCreate` mutation):

```json
[
  {
    "name": "Product Subtitle",
    "namespace": "purelane",
    "key": "subtitle",
    "type": "single_line_text_field",
    "ownerType": "PRODUCT",
    "description": "Secondary product description for cards and combo preview strips."
  },
  {
    "name": "Badge Text",
    "namespace": "purelane",
    "key": "badge_text",
    "type": "single_line_text_field",
    "ownerType": "PRODUCT",
    "description": "Custom badge pill text rendered on product cards."
  },
  {
    "name": "Combo Savings",
    "namespace": "purelane",
    "key": "combo_savings",
    "type": "single_line_text_field",
    "ownerType": "PRODUCT",
    "description": "Displays discount badge on Best-Selling Combos."
  },
  {
    "name": "Bottle Type Key",
    "namespace": "purelane",
    "key": "bottle_type",
    "type": "single_line_text_field",
    "ownerType": "PRODUCT",
    "description": "Maps product to vector bottle Data URI previews."
  }
]
```
