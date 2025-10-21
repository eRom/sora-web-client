# CLAUDE.md / AGENT.md

This file provides guidance to IA agent when working with code in this repository.

## Project Overview

This is a Next.js 15 project using the App Router, TypeScript, and Tailwind CSS. The project is set up with Shadcn/ui components and includes both light and dark theme support. Based on `PROJECT_IDEA.md`, this appears to be a French-language web application.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Formatting
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changing files
- `npm run format:staged` - Format staged files (likely for git hooks)

- Prepare Screenshots and optimize static images### PWA Setup
- `npm run pwa:setup` 
- 
### Icons generation
- `npm run icons` - Icons generation for Web and SEO

### Tests performance Lighthouse
Dependencies are already installed:
- `lighthouse` - Main library
- `chrome-launcher` - Headless Chrome launcher

Available Commands
- `npm run lighthouse:desktop` - Desktop test only
- `npm run lighthouse:mobile` - Mobile test only
- `npm run lighthouse:both` - Desktop + mobile test only

### Build System
- Uses Turbopack for both development and production builds
- No test framework is currently configured
- Prettier with Tailwind CSS plugin for code formatting

## Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS-in-JS theming system
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode switching
- **Animations**: tw-animate-css for Tailwind animations
- **Notifications**: Sonner for toast notifications
- **DB** Prisma

### Project Structure
```
src/
├── app/
│   ├── globals.css          # Tailwind CSS with custom theme variables
│   ├── layout.tsx           # Root layout with Geist fonts
│   └── page.tsx             # Home page (currently Next.js default)
├── components/
│   └── ui/                  # Shadcn/ui components
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
```

### Theme System
- Uses CSS custom properties for theming
- Light/dark themes with oklch color space
- Comprehensive design tokens for colors, spacing, and components
- Theme switching through next-themes

### Component System
- Shadcn/ui configured with "new-york" style
- Path aliases configured: `@/components`, `@/lib`, `@/lib/utils`
- RSC (React Server Components) enabled
- Components include: Button, Card, Sonner

## Development Notes

### Code Style
- ESLint configured with Next.js rules
- TypeScript with strict configuration
- No test framework currently set up
- Prettier configured with Tailwind CSS plugin for consistent formatting

### French Language Support
- Consider using `react/no-unescaped-entities` ESLint rule for French text

### Image static (Next/Image)
- Use **Next/Image** for images
- **Optimize** static image (except images for SEO)" using `npm run optimize:images`
- **Sizes Responsive** sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 50vw, 33vw"
- Placeholder **mode** : `blur`
- Blur **data** : It's a small JPEG image encoded in base64

### Accessibility
- WCAG AA compliance is a project requirement
- Mobile-first design approach
- Semantic HTML and proper ARIA attributes expected

### SEO Requirements
- Meta tags optimization required
- Social preview tags needed
- JSON-LD structured data (Person schema) planned

### Performance tests
- This project includes automated scripts to test performance with Lighthouse: `LIGHTHOUSE.md`