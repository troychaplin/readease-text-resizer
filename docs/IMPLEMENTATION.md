# FlexType Implementation Checklist

Step-by-step implementation guide for building the FlexType block.

## Phase 1: Block Foundation

### 1.1 Update block.json

- [ ] Change block name from `create-block/flextype` to `flextype/text-resizer`
- [ ] Update title to "FlexType Text Resizer"
- [ ] Update description
- [ ] Change category from `widgets` to `theme`
- [ ] Update icon (consider `editor-textcolor` or custom SVG)
- [ ] Add block supports:
  - [ ] `align`: `["left", "center", "right"]`
  - [ ] `color`: `{ "background": true, "text": true }`
  - [ ] `spacing`: `{ "margin": true, "padding": true }`
  - [ ] `typography`: `{ "fontSize": true }`
- [ ] Define all attributes:
  - [ ] `sizeSteps` (number, default: 3)
  - [ ] `minScale` (number, default: 0.9)
  - [ ] `maxScale` (number, default: 1.3)
  - [ ] `mobileOnly` (boolean, default: false)
  - [ ] `targetSelector` (string, default: "body")
  - [ ] `controlStyle` (string, default: "buttons", enum: buttons/slider/icons)
  - [ ] `showLabel` (boolean, default: true)
  - [ ] `labelText` (string, default: "Text Size")

### 1.2 Update index.js

- [ ] Import block metadata from block.json
- [ ] Import Edit component
- [ ] Register block with `registerBlockType`
- [ ] Confirm save returns null (dynamic block)

## Phase 2: Editor Component (edit.js)

### 2.1 Basic Structure

- [ ] Import required WordPress packages
- [ ] Set up `useBlockProps`
- [ ] Create basic component structure with InspectorControls

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
- [ ] Create "Advanced" panel:
  - [ ] `TextControl` for targetSelector

### 2.3 Editor Preview

- [ ] Render preview that matches frontend appearance
- [ ] Show buttons/slider/icons based on controlStyle
- [ ] Display label when showLabel is true
- [ ] Apply block supports (colors, spacing)

## Phase 3: Server-Side Render (render.php)

### 3.1 Basic Markup

- [ ] Build wrapper attributes with `get_block_wrapper_attributes()`
- [ ] Pass all config via data-* attributes for JS consumption
- [ ] Escape all output properly

### 3.2 Buttons Style Markup

- [ ] Create button group container
- [ ] Add decrease button with ARIA label
- [ ] Add reset button with ARIA label
- [ ] Add increase button with ARIA label
- [ ] Generate buttons based on sizeSteps attribute

### 3.3 Slider Style Markup

- [ ] Create range input with proper attributes
- [ ] Add min/max based on scale settings
- [ ] Include step calculation

### 3.4 Icons Style Markup

- [ ] Similar to buttons but with icon-only display
- [ ] Ensure adequate touch targets

### 3.5 Conditional Elements

- [ ] Show/hide label based on showLabel attribute
- [ ] Apply mobileOnly class for CSS targeting

## Phase 4: Frontend JavaScript (view.js)

### 4.1 Initialization

- [ ] Query all FlexType blocks on page
- [ ] Parse data attributes into config object
- [ ] Calculate scale steps array from min/max/steps

### 4.2 localStorage Integration

- [ ] Check for saved preference on load
- [ ] Apply saved scale immediately
- [ ] Set active state on corresponding control
- [ ] Save preference on change
- [ ] Handle storage events for cross-tab sync

### 4.3 Scale Application

- [ ] Find target element via selector
- [ ] Apply CSS custom property `--flextype-scale`
- [ ] Handle invalid selector gracefully

### 4.4 Button Controls

- [ ] Bind click handlers to all buttons
- [ ] Track current scale index
- [ ] Update active states on change
- [ ] Disable at min/max boundaries (optional)

### 4.5 Slider Controls

- [ ] Bind input/change handlers
- [ ] Map slider value to scale
- [ ] Update in real-time during drag

### 4.6 Multiple Instance Sync

- [ ] Listen for storage events
- [ ] Update all instances when one changes
- [ ] Sync active states across blocks

## Phase 5: Styles

### 5.1 Base Styles (style.scss)

- [ ] Block container layout (flexbox)
- [ ] Label styles
- [ ] Button group layout
- [ ] Individual button styles
- [ ] Active/selected state
- [ ] Focus states (visible, accessible)
- [ ] Hover states

### 5.2 Slider Styles

- [ ] Custom range input styling
- [ ] Track and thumb appearance
- [ ] Cross-browser compatibility

### 5.3 Icons Variant

- [ ] Minimal styling for icon-only mode
- [ ] Adequate touch target size (44px min)

### 5.4 Responsive

- [ ] Mobile-only visibility class
- [ ] Touch-friendly sizing

### 5.5 Accessibility

- [ ] High contrast focus indicators
- [ ] Reduced motion support (`prefers-reduced-motion`)
- [ ] RTL layout support

### 5.6 Editor Styles (editor.scss)

- [ ] Preview-specific adjustments
- [ ] Placeholder/empty state styling

## Phase 6: CSS Integration

### 6.1 Target Element Styling

- [ ] Inject base CSS custom property rule
- [ ] Apply font-size calculation to target
- [ ] Add transition for smooth resizing
- [ ] Consider `will-change` hint

### 6.2 Documentation

- [ ] Document how themes should integrate
- [ ] Provide example CSS snippets
- [ ] Note elements that shouldn't scale

## Phase 7: Accessibility

### 7.1 Keyboard Support

- [ ] All controls focusable via Tab
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work for slider

### 7.2 Screen Reader Support

- [ ] ARIA labels on all buttons
- [ ] Live region announcements (optional)
- [ ] Proper role attributes

### 7.3 Visual Accessibility

- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] No reliance on color alone

## Phase 8: Testing & Polish

### 8.1 Functional Testing

- [ ] Block appears in inserter
- [ ] All settings save correctly
- [ ] Frontend controls work
- [ ] Persistence works across pages
- [ ] Multiple instances sync

### 8.2 Theme Testing

- [ ] Test with Twenty Twenty-Five
- [ ] Test with at least one other block theme
- [ ] Verify block supports work (colors, spacing)

### 8.3 Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 8.4 Performance

- [ ] Verify view.js < 10KB minified
- [ ] No layout shift on load
- [ ] Smooth transitions

### 8.5 Code Quality

- [ ] All linters pass (`npm run lint`)
- [ ] No console errors
- [ ] Proper escaping in PHP

## Phase 9: Documentation

- [ ] Update README.md with usage instructions
- [ ] Update readme.txt for WP.org
- [ ] Add inline code comments where helpful
- [ ] Update TESTING.md with final test cases

## Completion Criteria

From REQUIREMENTS.md:

1. [ ] Block can be added via Site Editor to any template
2. [ ] Visitor can resize text with 1-2 clicks
3. [ ] Preference persists across page loads
4. [ ] Settings panel offers documented configuration options
5. [ ] Works with Twenty Twenty-Five or any block theme
6. [ ] Accessible (keyboard, screen reader friendly)
7. [ ] Under 10KB total frontend JavaScript
