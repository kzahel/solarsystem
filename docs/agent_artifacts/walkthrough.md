# Solar System Webapp Walkthrough

I have successfully implemented the 3D Solar System visualization using Vite, TypeScript, Three.js, and `astronomy-engine`.

## Features Implemented

### 1. Realistic Orbital Mechanics
-   **Library**: Used `astronomy-engine` for precise heliocentric positions.
-   **Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.
-   **Moons**: Earth's Moon implemented with geocentric orbit logic.
-   **Orbits**: Visualized with line loops showing the path.

### 2. Interactive Controls
-   **Time Scale**: Slider allows speeding up time (up to 365 days/sec) or reversing it.
-   **Min Planet Size**: Slider to scale up planets for better visibility while keeping orbits realistic.
-   **Camera**: "Free Fly" mode using WASD/Arrows and Mouse Look (Pointer Lock).

### 3. Visuals & UI
-   **Starfield**: Procedural star background.
-   **Constellations**: Toggleable lines connecting stars.
-   **Labels**: Toggleable text labels for all bodies using `CSS2DRenderer`.
-   **Sun**: Glowing central body with point light.
-   **UI**: Glassmorphism overlay for all settings.

## Verification Results

### Automated Tests
Ran `vitest` to verify orbital logic:
-   [x] **Earth Period**: Confirmed ~365.25 days.
-   [x] **Relative Speeds**: Confirmed Mercury moves faster than Earth.
-   [x] **Kepler's 2nd Law**: Confirmed Earth moves faster at Perihelion than Aphelion.

### Manual Verification Steps
1.  **Launch**: Run `npm run dev`.
2.  **Explore**: Click to lock mouse, use WASD to fly around.
3.  **Time**: Drag "Time Scale" slider to see planets race around the sun.
4.  **Scale**: Increase "Min Planet Size" to see planets clearly from a distance.
5.  **Toggles**: Turn on/off Constellations and Labels to clean up the view.

## Project Structure
-   `src/main.ts`: Entry point.
-   `src/SceneManager.ts`: Three.js setup.
-   `src/SolarSystem.ts`: Core simulation logic.
-   `src/CelestialBody.ts`: Planet/Moon rendering and updates.
-   `src/CameraController.ts`: Input handling.
-   `src/UIManager.ts`: HTML overlay.
