# Theme Troubleshooting Guide

## Common Error: "Can't resolve 'tw-animate-css'"

### Problem
You see this error when building:
```
CssSyntaxError: tailwindcss: Can't resolve 'tw-animate-css'
```

### Solution
Remove the `@import "tw-animate-css";` line from `globals.css`

**Why?** 
- You're using Tailwind CSS v4 which doesn't support this import syntax
- The animation library is `tailwindcss-animate` (already installed)
- It needs to be added as a plugin in `tailwind.config.js` instead

### Fixed Files

**globals.css** - Should only have:
```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));
```

**tailwind.config.js** - Should include:
```javascript
plugins: [
  heroui(),
  require("tailwindcss-animate")
],
```

## Your Current Theme Colors

### Light Mode
- Background: `#cccccc` (light gray)
- Primary: `#b71c1c` (dark red)
- Secondary: `#556b2f` (olive green)
- Accent: `#4682b4` (steel blue)

### Dark Mode
- Background: `#1a1a1a` (very dark gray)
- Primary: `#e53935` (bright red)
- Secondary: `#689f38` (light green)
- Accent: `#64b5f6` (light blue)

## How to Use Theme Colors in Components

Instead of hardcoded colors like `bg-gray-100` or `text-blue-500`, use:

- `bg-background` - Main background
- `text-foreground` - Main text
- `bg-card` - Card backgrounds
- `text-card-foreground` - Card text
- `bg-primary` - Primary buttons/accents
- `text-primary-foreground` - Text on primary
- `bg-secondary` - Secondary elements
- `text-muted-foreground` - Subtle text
- `border-border` - Borders
- `bg-chart-1` through `bg-chart-5` - Chart colors

## If Error Happens Again

1. Check `globals.css` - Remove any `@import "tw-animate-css"` lines
2. Check `tailwind.config.js` - Make sure `tailwindcss-animate` is in plugins array
3. Restart dev server: Stop and run `npm run dev` again
4. Clear cache: Delete `.next` folder and rebuild

## Changing Theme Colors

Edit the CSS variables in `globals.css`:

```css
:root {
  --primary: #your-color-here;
  --background: #your-color-here;
  /* etc... */
}
```

The changes will automatically apply to all components using theme classes!
