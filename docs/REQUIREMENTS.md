# Text_Resizer

A Gutenberg block that lets site visitors resize text for improved readability and accessibility.

## Hackathon Theme Connection

**Theme: Grow**

Text_Resizer embodies "grow" in a literal, interactive way—visitors can grow the text on your site to meet their needs. The text physically grows in response to user interaction, making accessibility feel dynamic rather than clinical.

---

## Overview

A simple, native Gutenberg block for block themes that provides site visitors with text enlargement controls. Theme builders can drop it into any template (header, footer, sidebar) via the Site Editor and configure a few options.

**Philosophy:** Simple, clean, focused. Do one thing well.

---

## Core Features

### Visitor-Facing

- **Size controls**: Buttons or icons (A-, A, A+) that adjust text size across the site
- **Persistent preference**: Remember the visitor's choice via localStorage
- **Smooth transitions**: Text resizes with a subtle CSS transition
- **Reset option**: Return to default size with one click

### Theme Builder Settings (Block Inspector)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `sizeSteps` | Number (2-5) | 3 | How many size options to offer |
| `minScale` | Number | 0.9 | Smallest multiplier (e.g., 90%) |
| `maxScale` | Number | 1.3 | Largest multiplier (e.g., 130%) |
| `mobileOnly` | Boolean | false | Only show controls on mobile/tablet |
| `targetSelector` | String | `body` | CSS selector for what gets resized |
| `controlStyle` | Select | `buttons` | `buttons`, `slider`, or `icons` |
| `showLabel` | Boolean | true | Show "Text Size" label |
| `labelText` | String | `Text Size` | Customizable label |

---

## Technical Requirements

### Block Registration

- **Block name:** `readease/text-resizer`
- **Category:** `theme` (or `widgets`)
- **Supports:**
  - `align`: `left`, `center`, `right`
  - `color`: background, text (for the control UI)
  - `spacing`: margin, padding
  - `typography`: fontSize (for the label)

### How It Works

1. Block renders a small UI component (buttons/slider/icons)
2. JavaScript handles click/change events
3. Applies a CSS custom property to the target selector: `--text-resizer-scale: 1.1`
4. Site's CSS uses this variable: `font-size: calc(1rem * var(--text-resizer-scale, 1))`
5. Preference saved to `localStorage` key: `text-resizerScale`
6. On page load, script checks localStorage and applies saved preference

### CSS Strategy

The block injects a small inline style or relies on theme.json integration:

```css
:root {
  --text-resizer-scale: 1;
}

/* Applied to target selector */
body {
  font-size: calc(1rem * var(--text-resizer-scale, 1));
}
```

Alternatively, use `zoom` or `transform: scale()` for broader effect (with tradeoffs).

### Accessibility

- Controls must be keyboard accessible
- ARIA labels on buttons: "Decrease text size", "Reset text size", "Increase text size"
- Respect `prefers-reduced-motion` for transitions
- Visible focus states on controls

---

## File Structure

```
text-resizer/
├── text-resizer.php                   # Plugin bootstrap
├── readme.txt                     # WP.org readme
├── REQUIREMENTS.md                # This file
├── src/
│   ├── block.json                 # Block metadata
│   ├── edit.js                    # Editor component
│   ├── save.js                    # Save component (minimal, dynamic)
│   ├── index.js                   # Block registration
│   ├── editor.scss                # Editor styles
│   └── style.scss                 # Frontend styles
├── build/                         # Compiled assets (gitignored)
└── includes/
    └── render.php                 # Dynamic render callback
```

---

## UI/UX Design

### Default Appearance (Buttons Style)

```
┌─────────────────────────────────┐
│  Text Size   [A-] [A] [A+]      │
└─────────────────────────────────┘
```

### Slider Style

```
┌─────────────────────────────────┐
│  Text Size   ────●────────      │
└─────────────────────────────────┘
```

### Icons Style (Minimal)

```
┌───────────────┐
│  🔍- 🔍 🔍+   │
└───────────────┘
```

### Visual Feedback

- Active/selected size should be visually highlighted
- Consider a brief "pulse" animation on the text when resized (ties to "Grow" theme)

---

## Edge Cases & Considerations

1. **Conflict with browser zoom**: Document that this complements, not replaces, browser zoom
2. **Fixed-size elements**: Some elements (images, icons) shouldn't scale—document for theme builders
3. **Multiple blocks**: If someone adds multiple instances, they should sync state
4. **No JS fallback**: Controls simply won't appear if JS is disabled (progressive enhancement)
5. **RTL support**: Ensure controls work in RTL layouts

---

## Future Enhancements (Out of Scope for Hackathon)

- Line height adjustment
- Letter spacing control  
- Font family switcher (dyslexia-friendly fonts)
- High contrast toggle
- Integration with theme.json typography presets
- Block patterns with pre-styled configurations

---

## Success Criteria

1. ✅ Block can be added via Site Editor to any template
2. ✅ Visitor can resize text with 1-2 clicks
3. ✅ Preference persists across page loads
4. ✅ Settings panel offers documented configuration options
5. ✅ Works with Twenty Twenty-Five or any block theme
6. ✅ Accessible (keyboard, screen reader friendly)
7. ✅ Under 10KB total frontend JavaScript

---

## Resources

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Create Block Tool](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [WCAG 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [theme.json Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)
