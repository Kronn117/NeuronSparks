# Development Guide

## Prerequisites

- Node.js 18.x
- npm 8+
- Expo CLI
- Git

## Setup

1. Clone the repository
2. `npm install`
3. `npm run web`

## Project Conventions

- Use functional components
- Keep components reusable and composable
- Prefer hooks for logic reuse
- Keep styles in component-scoped objects
- Use `@utils/`, `@components/`, and `@screens/` aliases when available

## Adding Features

1. Create the component in `src/components/` or `src/screens/`
2. Add context state or service logic if needed
3. Add routes in `src/navigation/`
4. Add validation in `src/utils/validation.js`
5. Add tests in `tests/unit/`

## Running Locally

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`

## Code Style

- `npm run lint`
- `npm run format`
- Follow consistent naming and theming
