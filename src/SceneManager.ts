import * as THREE from 'three';
import { Starfield } from './Starfield';
import { Sun } from './Sun';
import { SolarSystem } from './SolarSystem';
import { CameraController } from './CameraController';
import { UIManager } from './UIManager';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class SceneManager {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private sun: Sun;
    private solarSystem: SolarSystem;
    private cameraController: CameraController;
    private uiManager: UIManager;
    private labelRenderer: CSS2DRenderer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.clock = new THREE.Clock();

        // Initialize Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Initialize Environment
        const starfield = new Starfield(this.scene);
        this.sun = new Sun(this.scene);
        this.solarSystem = new SolarSystem(this.scene);
        this.solarSystem.onConstellationToggle = (visible) => starfield.setConstellationsVisible(visible);

        this.uiManager = new UIManager(this.solarSystem);
        console.log('UI Initialized', this.uiManager);

        // Initialize Camera
        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000000000; // Large far plane for solar system
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        this.cameraController = new CameraController(this.camera, this.canvas);

        // Initialize Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Initialize Label Renderer
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none'; // Let clicks pass through
        document.body.appendChild(this.labelRenderer.domElement);

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());

        // Start Loop
        this.animate();
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();

        this.solarSystem.update(deltaTime);
        this.sun.update(); // Pass deltaTime if needed

        this.cameraController.update(deltaTime);

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }
}
