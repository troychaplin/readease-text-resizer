# ReadEase: Text Resizer

A Gutenberg block that lets site visitors resize text for improved readability and accessibility.

## Features

- **Multiple control styles** - Dropdown, buttons, slider, or minimal icons
- **Customizable label** - Position label on top, side, or hide it completely
- **Flexible scale settings** - Configure min/max scale and number of size steps
- **Scale scope options** - Apply to full page or exclude template parts (header/footer)
- **Custom CSS selector** - Target specific elements with advanced selector option
- **Mobile-only mode** - Optionally show controls only on mobile/tablet devices
- **Persistent preferences** - Saves user choice via localStorage
- **Smooth transitions** - CSS-based scaling with smooth animations
- **Fully accessible** - Keyboard navigable with proper ARIA labels
- **Block theme support** - Native color and spacing controls

## Requirements

- WordPress 6.4+
- PHP 7.4+
- Block theme (e.g., Twenty Twenty-Five)

## Installation

1. Clone or download to `wp-content/plugins/text-resizer`
2. Run `npm install` and `npm run build`
3. Activate the plugin in WordPress
4. Add the Text_Resizer block to any template using the Site Editor

## Usage

### Control Styles

| Style | Description |
|-------|-------------|
| Dropdown | Select menu with percentage options |
| Buttons | Row of "A" buttons in increasing sizes |
| Slider | Range input with min/max labels |
| Icons | Minimal +/A/- button group |

### Block Settings

**Display Settings:**
- Control Style - Choose the UI control type
- Label Position - Top, side, or hidden
- Label Text - Customize the label (default: "Text Size")
- Mobile Only - Show controls only on smaller screens

**Scale Settings:**
- Scale Scope - Full page or exclude template parts
- Size Steps - Number of options (2-5)
- Minimum Scale - Smallest multiplier (1.0-1.2)
- Maximum Scale - Largest multiplier (1.1-1.5)

**Advanced:**
- Target Selector - Custom CSS selector for precise control

## Development

```bash
# Install dependencies
npm install

# Start development build with watch
npm start

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## License

GPL-2.0-or-later
