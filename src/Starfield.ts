import * as THREE from 'three';

export class Starfield {
    private stars: THREE.Points;

    constructor(scene: THREE.Scene, count: number = 10000) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Random position on a sphere (large radius)
            const r = 100000; // Background distance
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Random star color (mostly white/blue/yellow)
            const starType = Math.random();
            if (starType > 0.9) color.setHex(0xbbccff); // Blueish
            else if (starType > 0.7) color.setHex(0xffddaa); // Yellowish
            else color.setHex(0xffffff); // White

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 200, // Large size because they are far away
            vertexColors: true,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(geometry, material);
        scene.add(this.stars);

        this.createConstellations(scene, positions, count);
    }

    private constellations: THREE.LineSegments | null = null;

    private createConstellations(scene: THREE.Scene, positions: Float32Array, count: number) {
        const linePositions: number[] = [];
        // Connect some stars randomly to form "constellations"
        // Real constellations require a catalog. We'll simulate the look.

        for (let i = 0; i < count; i += 50) { // Skip through stars
            const startIdx = i * 3;
            const startVec = new THREE.Vector3(positions[startIdx], positions[startIdx + 1], positions[startIdx + 2]);

            // Find a few neighbors
            let connections = 0;
            for (let j = i + 1; j < count; j += 10) {
                if (connections > 2) break;

                const endIdx = j * 3;
                const endVec = new THREE.Vector3(positions[endIdx], positions[endIdx + 1], positions[endIdx + 2]);

                if (startVec.distanceTo(endVec) < 15000) { // Threshold distance
                    linePositions.push(startVec.x, startVec.y, startVec.z);
                    linePositions.push(endVec.x, endVec.y, endVec.z);
                    connections++;
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });

        this.constellations = new THREE.LineSegments(geometry, material);
        this.constellations.visible = false; // Hidden by default
        scene.add(this.constellations);
    }

    public setConstellationsVisible(visible: boolean) {
        if (this.constellations) {
            this.constellations.visible = visible;
        }
    }
}
