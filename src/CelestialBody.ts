import * as THREE from 'three';
import * as Astronomy from 'astronomy-engine';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export interface BodyData {
    name: string;
    body: Astronomy.Body;
    radiusKm: number; // Real radius in km
    color: number;
    texture?: string;
    parent?: CelestialBody; // For moons
}

export class CelestialBody {
    public mesh: THREE.Mesh;
    public orbitLine: THREE.Line;
    public label: CSS2DObject;
    public name: string;
    public body: Astronomy.Body;
    public radiusKm: number;

    private scene: THREE.Scene;
    private parentBody: CelestialBody | null;

    // Scaling constants
    private static readonly AU_TO_UNITS = 100; // 1 AU = 100 World Units
    private static readonly KM_TO_UNITS = 1 / 149597870.7 * 100; // Convert km to AU then to Units

    constructor(scene: THREE.Scene, data: BodyData, parentBody: CelestialBody | null = null) {
        this.scene = scene;
        this.name = data.name;
        this.body = data.body;
        this.radiusKm = data.radiusKm;
        this.parentBody = parentBody;

        // Create Mesh
        const geometry = new THREE.SphereGeometry(1, 64, 64); // Radius 1, scaled later
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.7,
            metalness: 0.1
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        // Create Orbit Line (Placeholder, will be updated)
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
        this.orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        this.scene.add(this.orbitLine);

        // Create Label
        const div = document.createElement('div');
        div.className = 'planet-label';
        div.textContent = this.name;
        div.style.marginTop = '-1em';
        div.style.color = 'white';
        div.style.fontSize = '12px';
        div.style.fontFamily = 'Inter, sans-serif';
        div.style.textShadow = '0 0 4px black';
        div.style.pointerEvents = 'none';

        this.label = new CSS2DObject(div);
        this.label.position.set(0, 1.5, 0); // Offset above planet
        this.mesh.add(this.label);
    }

    public update(date: Date, minSize: number) {
        // 1. Calculate Position
        let position: Astronomy.Vector;

        if (this.parentBody) {
            // It's a moon (e.g., Moon relative to Earth)
            position = Astronomy.GeoVector(this.body, date, true);
            // GeoVector returns km. Convert to AU then Units.
            // Wait, GeoVector is Earth-centered.
            // If we want generic moons, we need a different function, but Astronomy engine is Earth-centric mostly or Heliocentric.
            // For the Moon, GeoVector is perfect.

            // Convert km to Units
            // Actually, let's just use AU for everything intermediate.

            // Re-think scaling:
            // 1 AU = 100 units.
            // Moon distance ~384,400 km = 0.00257 AU = 0.257 units.

            const x_au = position.x / 149597870.7;
            const y_au = position.y / 149597870.7;
            const z_au = position.z / 149597870.7;

            this.mesh.position.set(
                this.parentBody.mesh.position.x + x_au * CelestialBody.AU_TO_UNITS,
                this.parentBody.mesh.position.y + y_au * CelestialBody.AU_TO_UNITS,
                this.parentBody.mesh.position.z + z_au * CelestialBody.AU_TO_UNITS
            );

        } else {
            // It's a planet (Heliocentric)
            position = Astronomy.HelioVector(this.body, date);

            this.mesh.position.set(
                position.x * CelestialBody.AU_TO_UNITS,
                position.y * CelestialBody.AU_TO_UNITS,
                position.z * CelestialBody.AU_TO_UNITS
            );
        }

        // 2. Update Scale (Visual Size)
        const realRadiusUnits = this.radiusKm * CelestialBody.KM_TO_UNITS;
        const visualRadius = Math.max(realRadiusUnits, minSize);

        this.mesh.scale.set(visualRadius, visualRadius, visualRadius);

        // 3. Rotation (Approximate for now)
        // Earth rotates 360 degrees in 24 hours.
        // We can use Astronomy.RotationAxis if we want precision, or just spin it.
        // Let's just spin it based on time for visual effect for now.
        const time = date.getTime() / 1000;
        this.mesh.rotation.y = time * 0.0001; // Arbitrary spin
    }

    public updateOrbitPath(date: Date) {
        if (!this.body) return;

        const points: THREE.Vector3[] = [];
        const samples = 360; // One point per degree roughly
        // Estimate period: Earth = 365 days.
        // We can just sample 1 year for everyone for simplicity, or look up period.
        // Let's sample 1 full orbit based on approximate period.
        // Mercury: 88, Venus: 225, Earth: 365, Mars: 687, Jupiter: 4333, Saturn: 10759, Uranus: 30687, Neptune: 60190
        // Moon: 27.3

        let periodDays = 365;
        if (this.name === 'Mercury') periodDays = 88;
        else if (this.name === 'Venus') periodDays = 225;
        else if (this.name === 'Mars') periodDays = 687;
        else if (this.name === 'Jupiter') periodDays = 4333;
        else if (this.name === 'Saturn') periodDays = 10759;
        else if (this.name === 'Uranus') periodDays = 30687;
        else if (this.name === 'Neptune') periodDays = 60190;
        else if (this.name === 'Moon') periodDays = 28;

        const step = periodDays / samples;
        const startDate = date;

        for (let i = 0; i <= samples; i++) {
            const sampleDate = new Date(startDate.getTime() + i * step * 24 * 60 * 60 * 1000);
            let pos: Astronomy.Vector;

            if (this.parentBody) {
                // Moon orbit relative to Earth
                pos = Astronomy.GeoVector(this.body, sampleDate, true);
                const x_au = pos.x / 149597870.7;
                const y_au = pos.y / 149597870.7;
                const z_au = pos.z / 149597870.7;

                // For orbit line, we want it relative to the parent's current position? 
                // No, orbit lines for moons are tricky because the parent moves.
                // We should draw the orbit relative to the parent (local space) if we parented the mesh.
                // But we didn't parent the mesh.
                // So we should draw it relative to the parent's *current* position.
                // Actually, let's just skip moon orbits for now or make them simple circles.
                // Or, just calculate the offset and add it to the parent's current position.
                points.push(new THREE.Vector3(
                    x_au * CelestialBody.AU_TO_UNITS,
                    y_au * CelestialBody.AU_TO_UNITS,
                    z_au * CelestialBody.AU_TO_UNITS
                ));
            } else {
                pos = Astronomy.HelioVector(this.body, sampleDate);
                points.push(new THREE.Vector3(
                    pos.x * CelestialBody.AU_TO_UNITS,
                    pos.y * CelestialBody.AU_TO_UNITS,
                    pos.z * CelestialBody.AU_TO_UNITS
                ));
            }
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.orbitLine.geometry.dispose();
        this.orbitLine.geometry = geometry;

        if (this.parentBody) {
            // If moon, the orbit line should move with the parent.
            // We can achieve this by setting the orbit line position to the parent position.
            this.orbitLine.position.copy(this.parentBody.mesh.position);
        }
    }
}
