# Text_Resizer Architecture

## Overview

Text_Resizer is a Gutenberg block plugin that provides text resizing controls for site visitors. This document outlines the technical architecture and component relationships.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        WordPress Admin                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Site Editor                             │  │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐   │  │
│  │  │  Block Library  │───▶│  Text_Resizer Block (edit.js)   │   │  │
│  │  └─────────────────┘    │  - Inspector Controls        │   │  │
│  │                         │  - Live Preview              │   │  │
│  │                         └─────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Saves attributes to post_content
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  render.php                                │  │
│  │  - Reads block attributes                                  │  │
│  │  - Outputs HTML markup                                     │  │
│  │  - Passes config to JS via data attributes                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                 │
│                                ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Frontend JS (view.js)                     │  │
│  │  - Initializes from data attributes                       │  │
│  │  - Handles user interactions                              │  │
│  │  - Manages localStorage persistence                       │  │
│  │  - Applies CSS custom property                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                 │
│                                ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  CSS Custom Property                       │  │
│  │  --text-resizer-scale applied to target selector              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Configuration (Editor → Storage)

```
User configures block in Site Editor
        │
        ▼
Block attributes saved to template/post
        │
        ▼
Attributes: {
  sizeSteps: 3,
  minScale: 0.9,
  maxScale: 1.3,
  controlStyle: 'buttons',
  targetSelector: 'body',
  ...
}
```

### 2. Rendering (Storage → Frontend)

```
Page request
        │
        ▼
WordPress loads template with block
        │
        ▼
render.php receives attributes
        │
        ▼
Outputs HTML with data-* attributes
        │
        ▼
<div class="wp-block-readease-text-resizer"
     data-size-steps="3"
     data-min-scale="0.9"
     data-max-scale="1.3"
     data-control-style="buttons"
     data-target-selector="body">
  <!-- Control UI -->
</div>
```

### 3. Interaction (User → DOM)

```
User clicks size control
        │
        ▼
view.js handles click event
        │
        ▼
Calculate new scale value
        │
        ▼
Apply CSS custom property:
document.querySelector(targetSelector)
  .style.setProperty('--text-resizer-scale', newScale)
        │
        ▼
Save to localStorage('text-resizerScale')
        │
        ▼
Update active state on controls
```

### 4. Persistence (localStorage → DOM)

```
Page load
        │
        ▼
view.js reads localStorage('text-resizerScale')
        │
        ▼
If value exists:
  - Apply saved scale to CSS property
  - Set active state on matching control
```

## File Structure

```
text-resizer/
├── text-resizer.php                    # Plugin bootstrap, block registration
├── package.json                    # Dependencies and scripts
├── composer.json                   # PHP dependencies
├── readme.txt                      # WP.org readme
├── .nvmrc                          # Node version
├── phpcs.xml.dist                  # PHP coding standards
├── .stylelintrc.json               # CSS linting
├── .eslintrc.js                    # JS linting (via @wordpress/scripts)
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md             # This file
│   ├── DEVELOPMENT.md              # Development guide
│   ├── IMPLEMENTATION.md           # Implementation checklist
│   ├── REQUIREMENTS.md             # Project requirements
│   └── TESTING.md                  # Testing guide
├── src/
│   └── text-resizer/                   # Block source files
│       ├── block.json              # Block metadata & attributes
│       ├── index.js                # Block registration
│       ├── edit.js                 # Editor component
│       ├── view.js                 # Frontend interactivity
│       ├── render.php              # Server-side render
│       ├── editor.scss             # Editor-only styles
│       └── style.scss              # Frontend styles
├── build/                          # Compiled assets (gitignored)
└── .github/
    ├── workflows/
    │   └── build.yml               # CI workflow
    └── PULL_REQUEST_TEMPLATE.md    # PR template
```

## Block Attributes Schema

```json
{
  "sizeSteps": {
    "type": "number",
    "default": 3
  },
  "minScale": {
    "type": "number",
    "default": 0.9
  },
  "maxScale": {
    "type": "number",
    "default": 1.3
  },
  "mobileOnly": {
    "type": "boolean",
    "default": false
  },
  "targetSelector": {
    "type": "string",
    "default": "body"
  },
  "controlStyle": {
    "type": "string",
    "default": "buttons",
    "enum": ["buttons", "slider", "icons"]
  },
  "showLabel": {
    "type": "boolean",
    "default": true
  },
  "labelText": {
    "type": "string",
    "default": "Text Size"
  }
}
```

## CSS Custom Property Strategy

The plugin uses CSS custom properties for maximum flexibility:

```css
/* Injected by plugin */
:root {
  --text-resizer-scale: 1;
}

/* Theme or plugin applies to target */
body {
  font-size: calc(1rem * var(--text-resizer-scale, 1));
  transition: font-size 0.2s ease;
}
```

### Scope Options

1. **Global (body)**: Affects all text on the page
2. **Content area**: Target `.entry-content` or similar
3. **Custom selector**: Theme builders can specify any valid CSS selector

## Multiple Instance Handling

When multiple Text_Resizer blocks exist on a page:

1. All instances share the same localStorage key
2. All instances listen for `storage` events
3. When one instance changes, others sync automatically
4. CSS property is global, so all respond to the same scale

```javascript
// Sync across instances
window.addEventListener('storage', (e) => {
  if (e.key === 'text-resizerScale') {
    applyScale(e.newValue);
    updateAllControls(e.newValue);
  }
});
```

## Performance Considerations

- Frontend JS target: < 10KB minified
- CSS loaded only when block is present
- No external dependencies
- localStorage for persistence (no server calls)
- CSS transitions use `will-change` hint for smooth rendering
