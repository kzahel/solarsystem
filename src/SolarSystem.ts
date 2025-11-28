import * as THREE from 'three';
import * as Astronomy from 'astronomy-engine';
import { CelestialBody, type BodyData } from './CelestialBody';

export class SolarSystem {
    private scene: THREE.Scene;
    private bodies: CelestialBody[] = [];
    private date: Date;

    // Settings
    public timeScale: number = 1; // Days per second? Or generic multiplier.
    // Let's say 1 real second = 1 simulation day by default.
    public minPlanetSize: number = 0.5; // Visual units

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.date = new Date(); // Start at current time
        this.createPlanets();
    }

    private createPlanets() {
        const planets: BodyData[] = [
            { name: 'Mercury', body: Astronomy.Body.Mercury, radiusKm: 2439.7, color: 0xaaaaaa },
            { name: 'Venus', body: Astronomy.Body.Venus, radiusKm: 6051.8, color: 0xffcc00 },
            { name: 'Earth', body: Astronomy.Body.Earth, radiusKm: 6371.0, color: 0x2233ff },
            { name: 'Mars', body: Astronomy.Body.Mars, radiusKm: 3389.5, color: 0xff4400 },
            { name: 'Jupiter', body: Astronomy.Body.Jupiter, radiusKm: 69911, color: 0xffaa88 },
            { name: 'Saturn', body: Astronomy.Body.Saturn, radiusKm: 58232, color: 0xffddaa },
            { name: 'Uranus', body: Astronomy.Body.Uranus, radiusKm: 25362, color: 0x88ffff },
            { name: 'Neptune', body: Astronomy.Body.Neptune, radiusKm: 24622, color: 0x4444ff },
        ];

        for (const data of planets) {
            const planet = new CelestialBody(this.scene, data);
            this.bodies.push(planet);

            if (data.name === 'Earth') {
                // Add Moon
                const moonData: BodyData = {
                    name: 'Moon',
                    body: Astronomy.Body.Moon,
                    radiusKm: 1737.4,
                    color: 0x888888
                };
                const moon = new CelestialBody(this.scene, moonData, planet);
                this.bodies.push(moon);
            }
        }

        // Initial orbit path calculation
        for (const body of this.bodies) {
            body.updateOrbitPath(this.date);
        }
    }

    public update(deltaTime: number) {
        // Advance time
        // deltaTime is in seconds.
        // timeScale = 1 means 1 day per second.
        const daysToAdd = deltaTime * this.timeScale;
        this.date = new Date(this.date.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        for (const body of this.bodies) {
            body.update(this.date, this.minPlanetSize);
        }
    }

    public setLabelsVisible(visible: boolean) {
        for (const body of this.bodies) {
            if (body.label) {
                body.label.visible = visible;
            }
        }
    }

    public setConstellationsVisible(visible: boolean) {
        // This needs access to Starfield.
        // We can dispatch an event or use a callback.
        if (this.onConstellationToggle) {
            this.onConstellationToggle(visible);
        }
    }

    public onConstellationToggle: ((visible: boolean) => void) | null = null;

    public getDate(): Date {
        return this.date;
    }
}
