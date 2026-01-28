=== ReadEase ===
Contributors:      troychaplin
Tags:              block, text, accessibility, resize, readability
Tested up to:      6.7
Stable tag:        1.0.0
Requires at least: 6.4
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Gutenberg block that lets site visitors resize text for improved readability and accessibility.

== Description ==

ReadEase provides a simple, native Gutenberg block named Text Resizer aimed for block theme builders that gives site visitors control over text size. Theme builders can add the block to any template (header, footer, sidebar) via the Site Editor.

Built with accessibility in mind, this block helps your site meet WCAG 2.1 text resize guidelines while providing a seamless experience for visitors who need larger text.

= Features =

* **Multiple control styles** - Choose from dropdown, buttons, slider, or minimal icons
* **Customizable label** - Position on top, side, or hide completely with custom text
* **Flexible scale settings** - Configure minimum/maximum scale (1.0x to 1.5x) and number of size steps (2-5)
* **Scale scope options** - Apply scaling to full page or exclude template parts (header/footer)
* **Custom CSS selector** - Target specific elements using advanced selector option
* **Mobile-only mode** - Show controls only on mobile and tablet devices
* **Persistent preferences** - Saves visitor choice via localStorage across sessions
* **Smooth CSS transitions** - Animated scaling with reduced motion support
* **Fully accessible** - Keyboard navigable with proper ARIA labels
* **Block theme support** - Native WordPress color, spacing, and alignment controls
* **Theme customization** - CSS custom properties for easy style overrides

= Control Styles =

* **Dropdown** - Select menu showing percentage options (e.g., 100%, 125%, 150%)
* **Buttons** - Row of "A" buttons in progressively larger sizes
* **Slider** - Range input with small/large "A" labels at each end
* **Icons** - Minimal button group with minus, reset (A), and plus controls

= For Theme Builders =

ReadEase integrates seamlessly with block themes. The block respects your theme's color palette and typography, and provides CSS custom properties for advanced customization.

**Customize the appearance in your theme CSS:**

`.wp-block-readease-text-resizer {`
`  --text-resizer-border-radius: 8px;`
`  --text-resizer-button-bg-hover: rgba(0, 0, 0, 0.1);`
`}`

See the full list of CSS custom properties in the [GitHub documentation](https://github.com/troychaplin/readease).

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/readease` or install via the WordPress plugins screen
2. Activate the plugin through the 'Plugins' screen
3. Open the Site Editor (Appearance > Editor)
4. Add the "ReadEase: Text Resizer" block to any template part (header, footer, etc.)
5. Configure the block settings in the sidebar panel

== Frequently Asked Questions ==

= Does this work with classic themes? =

ReadEase is designed for block themes that support the Site Editor. Classic themes are not supported.

= Where should I place the block? =

The block works best in persistent template parts like the header or footer, so visitors can access it on every page.

= How does the preference saving work? =

When a visitor selects a text size, their preference is saved to localStorage and automatically applied on future visits. The preference syncs across browser tabs.

= Can I target specific content areas? =

Yes! Use the "Exclude Template Parts" scope option to only scale main content (excludes header/footer), or use a custom CSS selector in the Advanced settings for precise control.

= How do I customize the block's appearance? =

The block supports WordPress color and spacing controls in the editor. For advanced customization, override the CSS custom properties in your theme's stylesheet.

= Does this affect browser zoom? =

No, ReadEase complements browser zoom - it doesn't replace it. The block uses CSS transforms to scale text independently of browser zoom settings.

= What about users with reduced motion preferences? =

ReadEase respects the `prefers-reduced-motion` media query. Transitions are disabled for users who have this preference enabled.

== Screenshots ==

1. Block editor preview with dropdown control style
2. Block settings panel showing display and scale options
3. Frontend view with buttons control style
4. Frontend view with slider control style
5. Icons control style - minimal button group

== Changelog ==

= 1.0.0 =
* Initial release
* Four control styles: dropdown, buttons, slider, icons
* Configurable label position (top, side, hidden) and custom text
* Scale scope with full page or exclude template parts option
* Custom CSS selector support for advanced targeting
* Mobile-only display option
* localStorage preference persistence with cross-tab sync
* Full accessibility support with ARIA labels and keyboard navigation
* CSS custom properties for theme customization
* Reduced motion support

== Upgrade Notice ==

= 1.0.0 =
Initial release of ReadEase: Text Resizer.
