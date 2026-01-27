=== Text Resizer ===
Contributors:      areziaal
Tags:              block, text, accessibility, resize, readability
Tested up to:      6.7
Stable tag:        1.0.0
Requires at least: 6.4
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Gutenberg block that lets site visitors resize text for improved readability and accessibility.

== Description ==

Text Resizer provides a simple, native Gutenberg block for block themes that gives site visitors control over text size. Theme builders can add the block to any template (header, footer, sidebar) via the Site Editor.

= Features =

* **Multiple control styles** - Choose from dropdown, buttons, slider, or minimal icons
* **Customizable label** - Position on top, side, or hide completely with custom text
* **Flexible scale settings** - Configure minimum/maximum scale and number of size steps
* **Scale scope options** - Apply scaling to full page or exclude template parts (header/footer)
* **Custom CSS selector** - Target specific elements using advanced selector option
* **Mobile-only mode** - Show controls only on mobile and tablet devices
* **Persistent preferences** - Saves visitor choice via localStorage
* **Smooth CSS transitions** - Animated scaling for better user experience
* **Fully accessible** - Keyboard navigable with proper ARIA labels
* **Block theme support** - Native WordPress color and spacing controls

= Control Styles =

* **Dropdown** - Select menu showing percentage options (e.g., 100%, 120%, 150%)
* **Buttons** - Row of "A" buttons in progressively larger sizes
* **Slider** - Range input with small/large labels at each end
* **Icons** - Minimal button group with minus, reset, and plus controls

= Block Settings =

**Display Settings:**

* Control Style - Select the UI control type
* Label Position - Top, side, or hidden
* Label Text - Customize the label text (default: "Text Size")
* Mobile Only - Only display controls on smaller screens

**Scale Settings:**

* Scale Scope - Full page or exclude template parts
* Size Steps - Number of size options (2-5)
* Minimum Scale - Smallest text multiplier (1.0-1.2)
* Maximum Scale - Largest text multiplier (1.1-1.5)

**Advanced:**

* Target Selector - Custom CSS selector for precise element targeting

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/text-resizer` or install via the WordPress plugins screen
2. Activate the plugin through the 'Plugins' screen
3. Open the Site Editor (Appearance > Editor)
4. Add the Text Resizer block to any template part (header, footer, etc.)
5. Configure the block settings in the sidebar panel

== Frequently Asked Questions ==

= Does this work with classic themes? =

Text Resizer is designed for block themes that support the Site Editor. Classic themes are not supported.

= Where should I place the block? =

The block works best in persistent template parts like the header or footer, so visitors can access it on every page.

= How does the preference saving work? =

When a visitor selects a text size, their preference is saved to localStorage and automatically applied on future visits.

= Can I target specific content areas? =

Yes, use the "Exclude Template Parts" scope option to only scale main content, or use a custom CSS selector in the Advanced settings.

== Screenshots ==

1. Block editor preview with dropdown control style
2. Block settings panel showing display and scale options
3. Frontend view with buttons control style
4. Frontend view with slider control style

== Changelog ==

= 0.1.0 =
* Initial release
* Four control styles: dropdown, buttons, slider, icons
* Configurable label position and text
* Scale scope with full page or exclude template parts option
* Custom CSS selector support
* Mobile-only display option
* localStorage preference persistence
* Full accessibility support with ARIA labels
