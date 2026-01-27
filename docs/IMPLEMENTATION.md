# Text_Resizer Implementation Checklist

Step-by-step implementation guide for building the Text_Resizer block, leveraging WordPress core functionality wherever possible.

## Phase 1: Block Foundation

### 1.1 Update block.json

- [ ] Change block name from `create-block/text-resizer` to `readease/text-resizer`
- [ ] Update title to "Text_Resizer Text Resizer"
- [ ] Update description
- [ ] Change category from `widgets` to `theme`
- [ ] Update icon (use Dashicon `editor-textcolor` or `@wordpress/icons`)
- [ ] Add `keywords` for discoverability: `["text", "size", "accessibility", "resize"]`
- [ ] Add block supports (core handles UI automatically):
  ```json
  "supports": {
    "align": ["left", "center", "right"],
    "color": {
      "background": true,
      "text": true,
      "link": false,
      "__experimentalDefaultControls": {
        "background": true,
        "text": true
      }
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "__experimentalDefaultControls": {
        "padding": true
      }
    },
    "typography": {
      "fontSize": true,
      "lineHeight": false
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "color": true,
        "radius": true
      }
    }
  }
  ```
- [ ] Define attributes with proper types and defaults

### 1.2 Update index.js

- [ ] Import block metadata from block.json
- [ ] Import Edit component
- [ ] Use `registerBlockType(metadata, { edit: Edit })` pattern
- [ ] No save function needed (returns null automatically for dynamic blocks with render.php)

## Phase 2: Editor Component (edit.js)

### 2.1 Basic Structure

- [ ] Use `useBlockProps()` - automatically applies block support classes/styles
- [ ] Use `InspectorControls` from `@wordpress/block-editor`
- [ ] Use core components from `@wordpress/components`:
  - `PanelBody` for collapsible sections
  - `RangeControl` for numeric sliders
  - `SelectControl` for dropdowns
  - `ToggleControl` for booleans
  - `TextControl` for text input
  - `__experimentalNumberControl` for precise numbers (if needed)

### 2.2 Inspector Controls

- [ ] Create "Display Settings" panel:
  - [ ] `RangeControl` for sizeSteps (min: 2, max: 5)
  - [ ] `SelectControl` for controlStyle (buttons/slider/icons)
  - [ ] `ToggleControl` for showLabel
  - [ ] `TextControl` for labelText (conditional on showLabel)
  - [ ] `ToggleControl` for mobileOnly
- [ ] Create "Scale Settings" panel:
  - [ ] `RangeControl` for minScale (min: 0.5, max: 1.0, step: 0.05)
  - [ ] `RangeControl` for maxScale (min: 1.0, max: 2.0, step: 0.05)
- [ ] Create "Advanced" panel (or use core Advanced section):
  - [ ] `TextControl` for targetSelector
  - [ ] Consider using `InspectorAdvancedControls` for targetSelector

### 2.3 Use Core Icons

- [ ] Import icons from `@wordpress/icons` instead of custom SVGs:
  - `minus` for decrease
  - `reset` for reset
  - `plus` for increase
  - Or use `formatLowercase` / `formatUppercase` for A-/A+

### 2.4 Editor Preview

- [ ] Render preview using same markup structure as frontend
- [ ] Block supports (colors, spacing, borders) applied automatically via `useBlockProps()`
- [ ] Consider using `Disabled` component to prevent interaction in preview

## Phase 3: Server-Side Render (render.php)

### 3.1 Leverage Core Functions

- [ ] Use `get_block_wrapper_attributes()` - automatically includes:
  - Block support classes (colors, spacing, alignment)
  - Block support inline styles
  - Custom class names from editor
  - Unique block ID if needed
- [ ] Use `wp_kses_post()` for escaping HTML attributes
- [ ] Use `esc_attr()` for data attributes
- [ ] Use `esc_html()` for text content
- [ ] Use `wp_interactivity_data_wp_context()` if using Interactivity API (see Phase 4)

### 3.2 Control Markup

- [ ] Use semantic HTML: `<button>` elements (not divs with click handlers)
- [ ] Native `<input type="range">` for slider (accessible by default)
- [ ] Use `role="group"` for button groups with `aria-label`

### 3.3 Conditional Rendering

- [ ] Use core `wp_style_is()` / `wp_script_is()` if checking dependencies
- [ ] Consider `wp_add_inline_style()` for dynamic CSS injection

## Phase 4: Frontend JavaScript (view.js)

### 4.1 Consider Interactivity API (WordPress 6.5+)

The Interactivity API is WordPress core's solution for frontend interactivity:

- [ ] Evaluate using `@wordpress/interactivity` instead of vanilla JS:
  ```json
  // block.json
  "supports": {
    "interactivity": true
  }
  ```
- [ ] Benefits: Declarative, reactive, integrates with block system
- [ ] If using Interactivity API:
  - [ ] Use `wp-interactive` directive in render.php
  - [ ] Use `wp_interactivity_state()` for global state
  - [ ] Use `wp_interactivity_data_wp_context()` for block context
- [ ] If NOT using (for simplicity/compatibility):
  - [ ] Use vanilla JS with `viewScript` in block.json

### 4.2 Standard Approach (vanilla JS)

- [ ] Use `DOMContentLoaded` or module pattern
- [ ] Query blocks via class `.wp-block-readease-text-resizer`
- [ ] Read config from `data-*` attributes
- [ ] Use `localStorage` for persistence
- [ ] Use `window.addEventListener('storage')` for cross-tab sync

### 4.3 Scale Application

- [ ] Use `document.documentElement` for `:root` targeting
- [ ] Use `setProperty()` for CSS custom properties
- [ ] Use `matchMedia()` for responsive behavior (mobileOnly)

## Phase 5: Styles

### 5.1 Leverage Block Supports

Block supports automatically generate classes - use these instead of custom:

- [ ] Alignment: `.alignleft`, `.aligncenter`, `.alignright`
- [ ] Colors: `.has-{color}-background-color`, `.has-{color}-color`
- [ ] Spacing: Uses inline styles via `useBlockProps()`
- [ ] Typography: Uses inline styles

### 5.2 Use CSS Custom Properties from theme.json

- [ ] Use core spacing tokens: `var(--wp--preset--spacing--20)` etc.
- [ ] Use core color tokens: `var(--wp--preset--color--primary)` etc.
- [ ] Use core font sizes: `var(--wp--preset--font-size--small)` etc.

### 5.3 Base Styles (style.scss)

- [ ] Use CSS logical properties for RTL support:
  - `margin-inline-start` instead of `margin-left`
  - `padding-inline` instead of `padding-left/right`
- [ ] Use `gap` for spacing (flexbox/grid)
- [ ] Use `:focus-visible` for keyboard-only focus (core supported)

### 5.4 Reduced Motion

- [ ] Wrap transitions in `@media (prefers-reduced-motion: no-preference)`
- [ ] Or use `prefers-reduced-motion: reduce` to disable

### 5.5 Editor Styles (editor.scss)

- [ ] Minimal - most styling comes from block supports
- [ ] Use `.editor-styles-wrapper` scope if needed

## Phase 6: CSS Integration

### 6.1 Inject Target Styles via PHP

- [ ] Use `wp_add_inline_style()` attached to block's style handle
- [ ] Or use `wp_enqueue_block_style()` for conditional loading
- [ ] Consider adding to theme.json `custom` section for theme integration

### 6.2 CSS Custom Property

```css
:root {
  --text-resizer-scale: 1;
}
```

- [ ] Inject via `wp_add_inline_style()` when block is present
- [ ] Theme can override with their own typography integration

## Phase 7: Accessibility

### 7.1 Use Native HTML (reduces ARIA needs)

- [ ] `<button>` elements are keyboard accessible by default
- [ ] `<input type="range">` has built-in keyboard support
- [ ] Only add ARIA where native semantics insufficient

### 7.2 Required ARIA

- [ ] `aria-label` on buttons for screen readers
- [ ] `aria-pressed` for toggle state (current size)
- [ ] `role="group"` with `aria-label` for button group
- [ ] `aria-live="polite"` region for announcements (optional)

### 7.3 Focus Management

- [ ] Use `:focus-visible` (core supports this)
- [ ] Ensure focus outline visible on all themes
- [ ] Don't remove focus indicators

## Phase 8: Testing & Polish

### 8.1 Verify Block Supports Work

- [ ] Color controls appear in inspector
- [ ] Spacing controls work
- [ ] Border controls work
- [ ] Alignment toolbar shows
- [ ] All generate correct classes/styles

### 8.2 Theme Compatibility

- [ ] Test with Twenty Twenty-Five
- [ ] Verify theme.json tokens work
- [ ] Check global styles integration

### 8.3 Performance

- [ ] Use `viewScript` (only loads when block present)
- [ ] Verify view.js < 10KB minified
- [ ] No render-blocking resources

## Phase 9: Optional Enhancements

### 9.1 Block Patterns (future)

- [ ] Register via `register_block_pattern()`
- [ ] Pre-configured Text_Resizer with styling

### 9.2 Block Bindings API (WP 6.5+)

- [ ] Could bind labelText to site option
- [ ] Not required for MVP

### 9.3 Block Hooks (WP 6.5+)

- [ ] Auto-insert into templates via `blockHooks` in block.json
- [ ] Not required for MVP

## Core Features Summary

| Feature | Core Solution |
|---------|---------------|
| Colors | Block supports `color` |
| Spacing | Block supports `spacing` |
| Borders | Block supports `__experimentalBorder` |
| Typography | Block supports `typography` |
| Alignment | Block supports `align` |
| Icons | `@wordpress/icons` package |
| Components | `@wordpress/components` package |
| i18n | `@wordpress/i18n` package |
| Frontend JS | Interactivity API or `viewScript` |
| RTL | CSS logical properties |
| Focus states | `:focus-visible` |
| Reduced motion | `prefers-reduced-motion` media query |

## Completion Criteria

From REQUIREMENTS.md:

1. [ ] Block can be added via Site Editor to any template
2. [ ] Visitor can resize text with 1-2 clicks
3. [ ] Preference persists across page loads
4. [ ] Settings panel offers documented configuration options
5. [ ] Works with Twenty Twenty-Five or any block theme
6. [ ] Accessible (keyboard, screen reader friendly)
7. [ ] Under 10KB total frontend JavaScript
