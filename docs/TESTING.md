# Text_Resizer Testing Guide

This document provides a comprehensive guide for testing the Text_Resizer Text Resizer block.

## Prerequisites

1. WordPress 6.4+ with a block theme (e.g., Twenty Twenty-Five)
2. Text_Resizer plugin activated
3. Build completed: `npm run build`

## Quick Start Testing

### 1. Verify Block Registration

1. Open the WordPress block editor (Site Editor or Post Editor)
2. Click the inserter (+ button)
3. Search for "Text_Resizer" or "text resizer"
4. Verify the block appears under the "Theme" category
5. Verify the icon displays correctly

### 2. Add the Block

1. Insert the Text_Resizer Text Resizer block
2. Verify the block renders a preview in the editor
3. Verify the inspector panel appears when the block is selected

## Control Style Testing

### Buttons Style (Default)

1. Add the block with "Buttons" control style selected
2. **Editor Preview:**
   - Verify 3 buttons display (A small, A medium, A large)
   - Verify the middle button appears "active" (highlighted)
   - Verify buttons are disabled/non-interactive in preview
3. **Frontend:**
   - View the page on the frontend
   - Click the smallest "A" button
   - Verify text on the page decreases in size
   - Click the largest "A" button
   - Verify text increases in size
   - Verify the active button is visually highlighted
   - Verify text transitions smoothly

### Slider Style

1. Change the Control Style to "Slider"
2. **Editor Preview:**
   - Verify slider with min/max A labels displays
   - Verify slider thumb is centered (1.0 default)
3. **Frontend:**
   - Drag the slider left (decrease)
   - Verify text shrinks
   - Drag the slider right (increase)
   - Verify text grows
   - Verify real-time feedback while dragging

### Icons Style

1. Change the Control Style to "Icons"
2. **Editor Preview:**
   - Verify 3 icon buttons display (-, A, +)
   - Verify the "A" (reset) button appears active
3. **Frontend:**
   - Click the minus (-) button
   - Verify text decreases by 0.1 step
   - Click again, verify continued decrease
   - Verify minus button disables at minimum scale
   - Click the plus (+) button
   - Verify text increases
   - Verify plus button disables at maximum scale
   - Click the A (reset) button
   - Verify scale returns to 1.0

## Inspector Controls Testing

### Display Settings Panel

| Setting | Test | Expected Result |
|---------|------|-----------------|
| Control Style | Change between buttons/slider/icons | Preview updates, frontend shows selected style |
| Show Label | Toggle off | "Text Size" label disappears |
| Label Text | Change to "Font Size" | Label text updates in preview and frontend |
| Mobile Only | Toggle on | Block hidden on desktop (782px+), visible on mobile |

### Scale Settings Panel

| Setting | Test | Expected Result |
|---------|------|-----------------|
| Size Steps | Change to 5 | Buttons style shows 5 buttons |
| Size Steps | Change to 2 | Buttons style shows 2 buttons |
| Minimum Scale | Set to 0.7 | Smallest option scales to 70% |
| Maximum Scale | Set to 1.5 | Largest option scales to 150% |

### Advanced Settings

| Setting | Test | Expected Result |
|---------|------|-----------------|
| Target Selector | Set to `.entry-content` | Only content area resizes, not entire page |
| Target Selector | Set to `main` | Main element resizes |

## Persistence Testing

### localStorage Persistence

1. Set a non-default scale (e.g., click the largest button)
2. Open browser DevTools → Application → Local Storage
3. Verify key `text-resizerScale` exists with the scale value
4. Refresh the page
5. Verify the scale is restored (same button active, same text size)

### Cross-Page Persistence

1. On Page A, set scale to maximum
2. Navigate to Page B (also has Text_Resizer block)
3. Verify the same scale is applied
4. Change scale on Page B
5. Return to Page A
6. Verify the new scale persists

### Cross-Tab Sync

1. Open the same page in two browser tabs
2. In Tab 1, change the scale
3. Switch to Tab 2
4. Verify the scale synced automatically (via storage event)

### Reset Behavior

1. Set a custom scale
2. Click the reset/middle button
3. Verify scale returns to 1.0
4. Verify localStorage updates to 1.0
5. Refresh page, verify default persists

## Accessibility Testing

### Keyboard Navigation

1. Tab to the control buttons
2. Verify visible focus outline on each control
3. Press Enter or Space on a button
4. Verify the scale changes
5. Verify focus is not lost after activation

### Screen Reader Testing

1. Using VoiceOver (Mac) or NVDA (Windows):
2. Navigate to the Text_Resizer block
3. Verify the group is announced as "Text size controls"
4. Verify each button announces its purpose:
   - "Decrease text size"
   - "Reset text size"
   - "Increase text size"
5. Verify pressed state is announced for active button

### ARIA Attributes

| Element | Attribute | Expected |
|---------|-----------|----------|
| Button group | role="group" | Present |
| Button group | aria-label | "Text size controls" |
| Active button | aria-pressed | "true" |
| Inactive buttons | aria-pressed | "false" |
| Slider | aria-label | "Text size" |

### Color Contrast

1. Use a contrast checker tool
2. Verify button borders have sufficient contrast (4.5:1 minimum)
3. Verify active button states are distinguishable
4. Verify focus outlines are visible

### Reduced Motion

1. Enable "Reduce Motion" in OS accessibility settings
2. Verify text size changes instantly (no CSS transitions)

## Block Supports Testing

### Color Settings

1. Open the block inspector
2. Expand "Color" settings
3. Set a background color
4. Set a text color
5. Verify colors apply to the block wrapper

### Spacing Settings

1. Open "Dimensions" or "Spacing" panel
2. Add padding
3. Add margin
4. Verify spacing applies correctly

### Border Settings

1. Expand border settings
2. Set border width, style, and color
3. Set border radius
4. Verify border applies to block wrapper

### Typography Settings

1. Set a custom font size for the block
2. Verify the label and buttons respect the font size

### Alignment

1. Set alignment to Left
2. Verify block aligns left
3. Set to Center and Right
4. Verify alignment changes

## Multiple Instances Testing

1. Add two Text_Resizer blocks on the same page
2. Interact with the first block
3. Verify the second block syncs (same scale, same active state)
4. Change scale on second block
5. Verify first block updates

## Edge Cases

### No JavaScript

1. Disable JavaScript in browser
2. Load the page
3. Verify the page is still readable
4. Verify the block renders but is non-functional

### Invalid localStorage

1. In DevTools Console, run: `localStorage.setItem('text-resizerScale', 'invalid')`
2. Refresh the page
3. Verify block defaults to 1.0 (graceful fallback)

### Scale Out of Range

1. In DevTools Console, run: `localStorage.setItem('text-resizerScale', '5.0')`
2. Refresh the page
3. Verify scale is clamped to maxScale

## Performance Checklist

- [ ] view.js file size < 10KB minified (check build output)
- [ ] No layout shift when controls load
- [ ] Smooth transitions at 60fps
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95

## Browser Compatibility

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Test Scenarios Checklist

### First-Time Visitor

- [ ] Clear localStorage before testing
- [ ] Load page with block
- [ ] Verify default scale (1.0) is active
- [ ] Change scale
- [ ] Verify text resizes
- [ ] Refresh page
- [ ] Verify scale persists

### Returning Visitor

- [ ] With existing localStorage value
- [ ] Load page
- [ ] Verify saved scale is applied immediately
- [ ] Verify correct button/slider shows active state

### Theme Compatibility

- [ ] Test with Twenty Twenty-Five
- [ ] Test with at least one other block theme
- [ ] Verify styles don't conflict with theme styles
