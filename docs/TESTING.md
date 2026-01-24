# FlexType Testing Guide

## Manual Testing Checklist

### Block Registration

- [ ] Block appears in inserter under "Theme" category
- [ ] Block icon displays correctly
- [ ] Block can be added to templates via Site Editor
- [ ] Block can be added to posts/pages

### Editor Experience

- [ ] Block renders preview in editor
- [ ] Inspector controls panel appears when block selected
- [ ] All settings work:
  - [ ] Size Steps (2-5)
  - [ ] Min Scale / Max Scale
  - [ ] Mobile Only toggle
  - [ ] Target Selector input
  - [ ] Control Style (buttons/slider/icons)
  - [ ] Show Label toggle
  - [ ] Label Text input
- [ ] Block supports work (color, spacing, alignment)
- [ ] Changes save correctly

### Frontend - Buttons Style

- [ ] Buttons render correctly
- [ ] Decrease button works (A-)
- [ ] Reset button works (A)
- [ ] Increase button works (A+)
- [ ] Active button is visually highlighted
- [ ] Text smoothly transitions
- [ ] Scale stays within bounds

### Frontend - Slider Style

- [ ] Slider renders correctly
- [ ] Dragging changes text size
- [ ] Position reflects current scale

### Frontend - Icons Style

- [ ] Icons render correctly
- [ ] All buttons functional

### Persistence

- [ ] Scale saves to localStorage
- [ ] Persists after page refresh
- [ ] Persists across pages
- [ ] Reset clears preference

### Multiple Instances

- [ ] Two blocks on same page sync state
- [ ] Changing one updates the other

### Accessibility

- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Visible focus states
- [ ] ARIA labels read correctly
- [ ] Works with reduced motion
- [ ] Color contrast meets WCAG AA

### Mobile/Tablet

- [ ] Controls work on touch devices
- [ ] Mobile-only setting functions correctly
- [ ] Touch targets adequate (44px+)

### Browser Compatibility

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Test Scenarios

### First-Time Visitor

1. Clear localStorage
2. Load page with block
3. Verify default scale active
4. Click increase
5. Verify text grows
6. Refresh page
7. Verify size persists

### Cross-Page Persistence

1. Set scale on page A
2. Navigate to page B (also has block)
3. Verify same scale applied
4. Change scale on page B
5. Return to page A
6. Verify updated scale

### Reset Behavior

1. Set custom scale
2. Verify localStorage has value
3. Click reset
4. Verify scale returns to default
5. Verify localStorage updated

### Custom Target Selector

1. Change target to `.entry-content`
2. Save and view frontend
3. Verify only content area resizes

### No JavaScript

1. Disable JavaScript
2. Load page
3. Page should still be readable

## Performance

- [ ] view.js < 10KB minified
- [ ] No significant layout shift
- [ ] Smooth transitions
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
