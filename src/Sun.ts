import * as THREE from 'three';

export class Sun {
    private mesh: THREE.Mesh;
    private light: THREE.PointLight;

    constructor(scene: THREE.Scene) {
        // Sun Geometry
        const radius = 10; // Base radius, will be scaled visually
        const geometry = new THREE.SphereGeometry(radius, 64, 64);

        // Emissive material for glowing effect
        const material = new THREE.MeshBasicMaterial({
            color: 0xffdd00,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);

        // Light Source
        this.light = new THREE.PointLight(0xffffff, 2, 0, 0); // Intense light, infinite decay
        this.light.position.set(0, 0, 0);
        scene.add(this.light);

        // Ambient light for base visibility
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
    }

    update() {
        // Optional: Pulse or rotate texture
    }
}
