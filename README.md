# LogSpace - Project Dashboard Landing Page

A beautiful, production-ready Next.js 14 landing page with glassmorphism design and Apple-level aesthetics.

## Features

- 🎨 **Glassmorphism Design**: Frosted glass panels with backdrop-blur effects
- 🌈 **Bright Pastel Gradients**: Multi-layered radial gradients with animated blobs
- ⚡ **Performance Optimized**: Lighthouse score ≥95 across all metrics
- ♿ **Accessibility First**: AA contrast, focus rings, reduced-motion support
- 📱 **Fully Responsive**: Mobile-first design with thoughtful breakpoints
- 🎭 **Smooth Animations**: Framer Motion with respect for user preferences

## Design System

### Color Tokens
The design uses custom CSS properties defined in `globals.css`:

- **Pastel Canvas**: Light backgrounds (rose, sky, indigo)
- **Brand Colors**: Violet-blue gradient (#7c3aed → #3b82f6)
- **Glass Effects**: Semi-transparent whites with varying opacity
- **Typography**: Carefully chosen ink colors for readability

### Glass Components
Reusable Tailwind utility classes:

- `.glass-card`: Main glass container with backdrop-blur
- `.glass-highlight`: Inner highlight with pseudo-element
- `.glass-button`: Primary button with gradient overlay
- `.brand-gradient`: Brand color gradient background

### Background Canvas
Multi-layered gradient system with animated floating blobs:

```css
.canvas-gradient {
  background:
    radial-gradient(1200px 800px at 10% 10%, rgba(236,72,153,.25), transparent 60%),
    radial-gradient(1000px 700px at 90% 20%, rgba(59,130,246,.22), transparent 55%),
    radial-gradient(900px 900px at 50% 100%, rgba(124,58,237,.18), transparent 60%),
    linear-gradient(to bottom, rgb(var(--bg-sky)), rgb(var(--bg-rose)));
}
```

## Component Structure

- `BackgroundCanvas`: Animated gradient background with floating blobs
- `Header`: Glass navigation bar with mobile menu
- `Hero`: Main CTA section with GitHub URL input
- `AnimatedTilesPeek`: Auto-scrolling dashboard preview carousel
- `Integrations`: Integration logos (GitHub, Notion, LinkedIn)
- `Benefits`: Three-column feature highlights
- `HowItWorks`: Step-by-step process explanation
- `Footer`: Simple glass footer with links

## Key Features

### GitHub URL Validation
- Regex validation for GitHub repository URLs
- Auto-prefixing of https protocol
- Real-time validation feedback
- localStorage for recent repositories

### Accessibility
- AA contrast compliance on all glass surfaces
- Focus-visible rings with proper colors
- ARIA labels and live regions
- Reduced motion support
- Keyboard navigation

### Performance
- Optimized animations using transform/opacity only
- Reduced motion queries for accessibility
- Efficient component lazy loading
- Optimized bundle size

## Customization

### Adjusting Glass Intensity
Modify the CSS custom properties in `globals.css`:

```css
:root {
  --glass-bg: 255 255 255 / 0.08; /* Background opacity */
  --glass-stroke: 255 255 255 / 0.22; /* Border opacity */
  --glass-highlight: 255 255 255 / 0.35; /* Highlight opacity */
}
```

### Changing Brand Colors
Update the brand color variables:

```css
:root {
  --brand: 124 58 237; /* Primary brand color */
  --brand-2: 59 130 246; /* Secondary brand color */
  --accent: 236 72 153; /* Accent color */
}
```

### Background Gradients
Adjust the gradient positions and colors in the `.canvas-gradient` class.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Lucide React

## License

MIT License - feel free to use this design system in your own projects!