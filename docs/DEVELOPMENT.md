# FlexType Development Guide

## Prerequisites

- Node.js 18+ and npm
- WordPress 6.4+ with a block theme (e.g., Twenty Twenty-Five)
- Local development environment (LocalWP, wp-env, DDEV, etc.)

## Setup

### 1. Clone/Install the Plugin

```bash
cd wp-content/plugins/flextype
npm install
```

### 2. Development Commands

```bash
# Start development build with watch mode
npm start

# Build for production
npm run build

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css

# Format code
npm run format
```

## Project Structure

```
flextype/
├── flextype.php              # Plugin bootstrap
├── package.json              # Dependencies and scripts
├── readme.txt                # WP.org readme
├── REQUIREMENTS.md           # Project requirements
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # Technical architecture
│   ├── DEVELOPMENT.md        # This file
│   └── TESTING.md            # Testing guide
├── src/                      # Source files
│   ├── block.json            # Block metadata
│   ├── index.js              # Block registration
│   ├── edit.js               # Editor component
│   ├── save.js               # Save component
│   ├── view.js               # Frontend script
│   ├── editor.scss           # Editor styles
│   └── style.scss            # Frontend styles
├── build/                    # Compiled assets (gitignored)
└── includes/
    └── render.php            # Server-side render
```

## Development Workflow

### Creating the Block

The block uses `@wordpress/scripts` for build tooling. Key files:

**block.json** - Block metadata and configuration:
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "flextype/text-resizer",
  "title": "FlexType Text Resizer",
  "category": "theme",
  "icon": "editor-textcolor",
  "description": "Let visitors resize text for better readability.",
  "supports": {
    "align": ["left", "center", "right"],
    "color": {
      "background": true,
      "text": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true
    }
  },
  "attributes": { ... },
  "textdomain": "flextype",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js",
  "render": "file:../includes/render.php"
}
```

**edit.js** - Editor component with inspector controls:
```jsx
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Settings', 'flextype')}>
          {/* Controls here */}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {/* Preview UI */}
      </div>
    </>
  );
}
```

**save.js** - Returns null for dynamic blocks:
```jsx
export default function save() {
  return null;
}
```

**view.js** - Frontend interactivity:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.wp-block-flextype-text-resizer');
  blocks.forEach(initBlock);
});
```

### Working with Styles

**editor.scss** - Editor-specific styles:
```scss
.wp-block-flextype-text-resizer {
  // Editor preview styles
}
```

**style.scss** - Frontend styles (also loaded in editor):
```scss
.wp-block-flextype-text-resizer {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__label {
    font-weight: 500;
  }

  &__controls {
    display: flex;
    gap: 0.25rem;
  }

  &__button {
    // Button styles
  }
}
```

## Adding Inspector Controls

Use WordPress components for the settings panel:

```jsx
<InspectorControls>
  <PanelBody title={__('Display Settings', 'flextype')}>
    <RangeControl
      label={__('Size Steps', 'flextype')}
      value={attributes.sizeSteps}
      onChange={(value) => setAttributes({ sizeSteps: value })}
      min={2}
      max={5}
    />
    <SelectControl
      label={__('Control Style', 'flextype')}
      value={attributes.controlStyle}
      options={[
        { label: 'Buttons', value: 'buttons' },
        { label: 'Slider', value: 'slider' },
        { label: 'Icons', value: 'icons' },
      ]}
      onChange={(value) => setAttributes({ controlStyle: value })}
    />
    <ToggleControl
      label={__('Show Label', 'flextype')}
      checked={attributes.showLabel}
      onChange={(value) => setAttributes({ showLabel: value })}
    />
  </PanelBody>
</InspectorControls>
```

## Frontend JavaScript Pattern

```javascript
// view.js
const STORAGE_KEY = 'flextypeScale';
const CSS_PROPERTY = '--flextype-scale';

function initBlock(container) {
  const config = {
    sizeSteps: parseInt(container.dataset.sizeSteps, 10),
    minScale: parseFloat(container.dataset.minScale),
    maxScale: parseFloat(container.dataset.maxScale),
    targetSelector: container.dataset.targetSelector,
    controlStyle: container.dataset.controlStyle,
  };

  // Calculate scale values
  const scales = calculateScales(config);

  // Restore saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyScale(saved, config.targetSelector);
  }

  // Bind event handlers
  bindControls(container, scales, config);
}

function calculateScales({ sizeSteps, minScale, maxScale }) {
  const scales = [];
  const step = (maxScale - minScale) / (sizeSteps - 1);
  for (let i = 0; i < sizeSteps; i++) {
    scales.push(minScale + (step * i));
  }
  return scales;
}

function applyScale(scale, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (target) {
    target.style.setProperty(CSS_PROPERTY, scale);
  }
}
```

## Debugging Tips

### Enable WordPress Debug Mode

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('SCRIPT_DEBUG', true);
```

### Browser DevTools

- Check localStorage: `localStorage.getItem('flextypeScale')`
- Inspect CSS property: Look for `--flextype-scale` in computed styles
- Console logging: `console.log('FlexType:', config)`

### Block Editor Debugging

- Open browser console in Site Editor
- Check for block registration: `wp.blocks.getBlockTypes().find(b => b.name === 'flextype/text-resizer')`
- Inspect block attributes in React DevTools

## Code Standards

- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use ES6+ features (transpiled by @wordpress/scripts)
- Keep functions small and focused
- Add JSDoc comments for complex functions
- Prefer `const` over `let`, avoid `var`

## Building for Production

```bash
npm run build
```

This creates optimized assets in the `build/` directory:
- Minified JavaScript
- Processed CSS
- Asset manifest for cache busting
