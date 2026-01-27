# Text_Resizer Development Guide

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- WordPress 6.4+ with a block theme (e.g., Twenty Twenty-Five)
- Local development environment (wp-env, LocalWP, DDEV, etc.)

## Setup

### 1. Install Dependencies

```bash
cd wp-content/plugins/text-resizer
npm install
composer install
```

### 2. Development Commands

```bash
# Start development build with watch mode
npm start

# Build for production
npm run build

# Lint all (JS, CSS, PHP)
npm run lint

# Format all
npm run format

# Individual linters
npm run lint:js
npm run lint:css
npm run lint:php

# Individual formatters
npm run format:js
npm run format:css
npm run format:php
```

## Project Structure

```
text-resizer/
├── text-resizer.php                    # Plugin bootstrap
├── package.json                    # Node dependencies and scripts
├── composer.json                   # PHP dependencies
├── src/
│   └── text-resizer/                   # Block source files
│       ├── block.json              # Block metadata
│       ├── index.js                # Block registration
│       ├── edit.js                 # Editor component
│       ├── view.js                 # Frontend script
│       ├── render.php              # Server-side render
│       ├── editor.scss             # Editor styles
│       └── style.scss              # Frontend styles
├── build/                          # Compiled assets (gitignored)
└── docs/                           # Documentation
```

## Build Output

The `@wordpress/scripts` build generates:

| File | Purpose | Loaded |
|------|---------|--------|
| `build/text-resizer/index.js` | Block registration + editor | Editor only |
| `build/text-resizer/index.css` | Editor styles | Editor only |
| `build/text-resizer/style-index.css` | Frontend + editor styles | Both |
| `build/text-resizer/view.js` | Frontend interactivity | Frontend only |
| `build/text-resizer/render.php` | Server-side render | Frontend only |

## Key Files

### block.json

Block metadata, attributes, and asset references:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "readease/text-resizer",
  "title": "Text_Resizer Text Resizer",
  "category": "theme",
  "attributes": { ... },
  "supports": { ... },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js",
  "render": "file:./render.php"
}
```

### edit.js

Editor component with inspector controls:

```jsx
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Settings', 'text-resizer')}>
          {/* Controls */}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {/* Preview UI */}
      </div>
    </>
  );
}
```

### render.php

Server-side render with data attributes for JS:

```php
<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'data-size-steps'     => $attributes['sizeSteps'],
    'data-min-scale'      => $attributes['minScale'],
    'data-max-scale'      => $attributes['maxScale'],
    'data-control-style'  => $attributes['controlStyle'],
    'data-target-selector'=> $attributes['targetSelector'],
]);
?>
<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
    <!-- Control markup -->
</div>
```

### view.js

Frontend interactivity:

```javascript
const STORAGE_KEY = 'text-resizerScale';
const CSS_PROPERTY = '--text-resizer-scale';

document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.wp-block-readease-text-resizer');
  blocks.forEach(initBlock);
});
```

## Debugging

### WordPress Debug Mode

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('SCRIPT_DEBUG', true);
```

### Browser DevTools

- localStorage: `localStorage.getItem('text-resizerScale')`
- CSS property: Check computed styles for `--text-resizer-scale`
- Block registration: `wp.blocks.getBlockTypes().find(b => b.name === 'readease/text-resizer')`

## Code Standards

- PHP: WordPress Coding Standards (via PHPCS)
- JavaScript: @wordpress/eslint-plugin
- CSS/SCSS: @wordpress/stylelint-config + @stylistic/stylelint-plugin

## Building for Production

```bash
npm run build
```

Creates optimized, minified assets in `build/` with cache-busting manifests.
