# Solar System Webapp Implementation Plan

## Goal Description
Create a visually stunning 3D solar system visualization using Vite and TypeScript. The app will feature realistic (but scalable) planets, a controllable camera, and various visualization settings like time scale, labels, and constellations.

## Proposed Changes

### Project Structure
- **Framework**: Vite (Vanilla TS template)
- **3D Engine**: Three.js
- **UI**: HTML/CSS (Custom "Premium" overlay)

### Core Components

#### [NEW] `src/main.ts`
- Entry point.
- Initializes `SceneManager`.

#### [NEW] `src/SceneManager.ts`
- Handles Three.js initialization (Scene, Camera, Renderer).
- Manages the animation loop.
- Handles window resize.

#### [NEW] `src/SolarSystem.ts`
- Manages the creation and update of celestial bodies.
- Uses `astronomy-engine` to calculate precise positions for planets and the Moon based on the current simulation time.
- Methods: `createPlanets()`, `update(currentDate, minPlanetSize)`.

#### [NEW] `src/CelestialBody.ts`
- Class representing a planet or moon.
- Handles mesh creation, texture loading.
- Updates position based on Heliocentric coordinates provided by `SolarSystem` (via `astronomy-engine`).
- Supports "Minimum Size" scaling logic.

#### [NEW] `src/CameraController.ts`
- Implements the "Free Fly" camera logic.
- Listens to Mouse movement for look.
- Listens to Arrow keys for movement.

#### [NEW] `src/InputManager.ts`
- Handles keyboard and mouse input state.

#### [NEW] `src/UIManager.ts`
- Manages the HTML overlay.
- Event listeners for sliders and toggles.
- Updates `SolarSystem` state based on UI.

#### [NEW] `src/assets/`
- Placeholders or generated textures for planets.
- Starfield background.

### Detailed Features

1.  **Visuals**:
    -   **Sun**: Glowing mesh + PointLight.
    -   **Planets**: SphereGeometry with textures.
    -   **Orbits**: LineLoop showing the path (calculated by sampling `astronomy-engine` points).
    -   **Stars**: PointsMaterial or Skybox.
    -   **Constellations**: LineSegments connecting specific stars (mocked or real data if available).

2.  **Controls**:
    -   **Time Scale**: Multiplier for time progression (e.g., 1 sec = 1 day).
    -   **Camera**:
        -   `PointerLockControls` style for looking.
        -   Vector movement for position (Arrow keys).

3.  **UI**:
    -   Glassmorphism style panel.
    -   Inputs: Range sliders, Checkboxes.

## Verification Plan

### Automated Tests (Vitest)
- **Orbit Period Accuracy**:
    -   Simulate 365.25 days. Verify Earth returns to roughly the same heliocentric longitude.
    -   Verify Mercury completes ~4 orbits in that time.
- **Daily Rotation**:
    -   Verify Earth's rotation angle increments correctly over 24 hours.
- **Position Accuracy**:
    -   Check planet positions against known values for a specific epoch (e.g., J2000).
    -   Run simulation for 10 years, then verify positions again.
- **Relative Speeds**:
    -   Assert that inner planets have higher angular velocity than outer planets.
- **Kepler's 2nd Law (Variable Speed)**:
    -   Verify that a planet moves faster at perihelion than aphelion.

### Manual Verification
- Launch app with `npm run dev`.
- Verify Sun and planets are visible.
- Test "Time Scale": Planets should speed up/slow down/reverse.
- Test "Min Size": Small planets (Mercury) should grow when slider increases.
- Test "Camera": Arrow keys move, Mouse looks.
- Test "Labels": Toggle on/off.
- Test "Constellations": Toggle on/off.
