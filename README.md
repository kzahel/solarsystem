# Solar System Visualization

> 🚀 **[Live Demo: kyle.graehl.org/solarsystem](https://kyle.graehl.org/solarsystem/)**

A 3D visualization of the solar system using Vite, Three.js, and Astronomy Engine.

## Development

### Setup
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Agent Instructions & Contribution Guidelines

**ATTENTION AGENTS:** Please follow these rules when working on this repository to ensure code quality and build stability.

1.  **TypeScript Verification:**
    *   **Trigger:** Whenever you edit any TypeScript file (`.ts`, `.tsx`).
    *   **Action:** Run `npx tsc --noEmit` to verify that there are no type errors.
    *   **Goal:** Ensure strict type safety is maintained.

2.  **Pre-Commit/Pre-Push Check:**
    *   **Trigger:** Before you commit changes or push to the remote repository.
    *   **Action:** Run `npm run build`.
    *   **Goal:** Ensure the application builds successfully for production. The build command (`tsc && vite build`) runs type checking and the Vite build process.

**Do not commit or push code that fails the build.**
