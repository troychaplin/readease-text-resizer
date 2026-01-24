# FlexType Testing Guide

## Manual Testing Checklist

### Block Registration

- [ ] Block appears in block inserter under "Theme" category
- [ ] Block icon displays correctly
- [ ] Block description shows in inserter
- [ ] Block can be added to templates via Site Editor
- [ ] Block can be added to posts/pages

### Editor Experience

- [ ] Block renders preview in editor
- [ ] Inspector controls panel appears when block selected
- [ ] All settings are adjustable:
  - [ ] Size Steps (2-5)
  - [ ] Min Scale (0.5-1.0)
  - [ ] Max Scale (1.0-2.0)
  - [ ] Mobile Only toggle
  - [ ] Target Selector input
  - [ ] Control Style select (buttons/slider/icons)
  - [ ] Show Label toggle
  - [ ] Label Text input
- [ ] Color settings work (background, text)
- [ ] Spacing settings work (margin, padding)
- [ ] Alignment options work (left, center, right)
- [ ] Changes save correctly

### Frontend - Buttons Style

- [ ] Buttons render correctly
- [ ] Decrease button works (A-)
- [ ] Reset button works (A)
- [ ] Increase button works (A+)
- [ ] Active button is visually highlighted
- [ ] Text smoothly transitions when resized
- [ ] Scale stays within min/max bounds

### Frontend - Slider Style

- [ ] Slider renders correctly
- [ ] Dragging slider changes text size
- [ ] Slider position reflects current scale
- [ ] Smooth transitions during drag

### Frontend - Icons Style

- [ ] Icons render correctly
- [ ] All icon buttons functional
- [ ] Appropriate sizing for minimal UI

### Persistence

- [ ] Scale preference saves to localStorage
- [ ] Preference persists after page refresh
- [ ] Preference persists across pages
- [ ] Reset button clears saved preference
- [ ] Clearing localStorage resets to default

### Multiple Instances

- [ ] Two blocks on same page sync state
- [ ] Changing one updates the other
- [ ] Both show correct active state

### Accessibility

- [ ] Controls are keyboard accessible (Tab, Enter, Space)
- [ ] Focus states are visible
- [ ] Screen reader announces button purposes
- [ ] ARIA labels are correct:
  - "Decrease text size"
  - "Reset text size"
  - "Increase text size"
- [ ] Works with reduced motion preference
- [ ] Color contrast meets WCAG AA

### Mobile/Tablet

- [ ] Controls work on touch devices
- [ ] Mobile-only setting hides on desktop
- [ ] Mobile-only setting shows on mobile
- [ ] Touch targets are adequate size (44px minimum)

### RTL Support

- [ ] Controls display correctly in RTL
- [ ] Layout mirrors appropriately

### Theme Compatibility

Test with multiple block themes:
- [ ] Twenty Twenty-Five
- [ ] Twenty Twenty-Four
- [ ] Twenty Twenty-Three
- [ ] Custom block theme (if available)

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Test Scenarios

### Scenario 1: First-Time Visitor

1. Clear localStorage
2. Load page with FlexType block
3. Verify default scale (1.0) is active
4. Click increase button
5. Verify text grows
6. Refresh page
7. Verify larger size persists

### Scenario 2: Returning Visitor

1. Set a custom scale
2. Close browser completely
3. Reopen and load page
4. Verify saved scale is applied immediately

### Scenario 3: Cross-Page Persistence

1. Set scale on page A
2. Navigate to page B (also has block)
3. Verify same scale is applied
4. Change scale on page B
5. Return to page A
6. Verify updated scale shows

### Scenario 4: Reset Behavior

1. Set custom scale
2. Verify localStorage has value
3. Click reset button
4. Verify scale returns to default (1.0)
5. Verify localStorage is updated

### Scenario 5: Boundary Testing

1. Click decrease until minimum reached
2. Verify button disables or scale stops
3. Click increase until maximum reached
4. Verify button disables or scale stops

### Scenario 6: Custom Target Selector

1. In editor, change target to `.entry-content`
2. Save and view frontend
3. Verify only content area resizes, not headers/footers

### Scenario 7: No JavaScript

1. Disable JavaScript in browser
2. Load page with FlexType block
3. Verify controls don't appear (progressive enhancement)
4. Page should still be readable

## Performance Testing

### Bundle Size

```bash
# Check built file sizes
ls -la build/

# Target: < 10KB for view.js (minified)
```

### Lighthouse Audit

Run Lighthouse on a page with the block:
- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] No blocking resources from plugin

### Layout Shift

- [ ] Text resize doesn't cause significant CLS
- [ ] Controls don't shift during load

## Automated Testing (Future)

### Unit Tests (Jest)

```javascript
// Example test structure
describe('calculateScales', () => {
  it('should return correct number of steps', () => {
    const scales = calculateScales({
      sizeSteps: 3,
      minScale: 0.9,
      maxScale: 1.3
    });
    expect(scales).toHaveLength(3);
  });

  it('should include min and max values', () => {
    const scales = calculateScales({
      sizeSteps: 3,
      minScale: 0.9,
      maxScale: 1.3
    });
    expect(scales[0]).toBe(0.9);
    expect(scales[2]).toBe(1.3);
  });
});
```

### E2E Tests (Playwright/Puppeteer)

```javascript
// Example E2E test
test('should persist scale across page refresh', async ({ page }) => {
  await page.goto('/page-with-flextype/');

  // Click increase button
  await page.click('[data-action="increase"]');

  // Verify scale changed
  const scale = await page.evaluate(() =>
    getComputedStyle(document.body).getPropertyValue('--flextype-scale')
  );
  expect(parseFloat(scale)).toBeGreaterThan(1);

  // Refresh and verify persistence
  await page.reload();
  const persistedScale = await page.evaluate(() =>
    getComputedStyle(document.body).getPropertyValue('--flextype-scale')
  );
  expect(persistedScale).toBe(scale);
});
```

## Bug Report Template

When filing bugs, include:

```markdown
## Description
[Clear description of the issue]

## Steps to Reproduce
1.
2.
3.

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- WordPress version:
- PHP version:
- Theme:
- Browser:
- Plugin version:

## Screenshots/Videos
[If applicable]

## Console Errors
[Any JavaScript errors]
```
