import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class CameraController {
    private camera: THREE.Camera;
    private controls: PointerLockControls;
    private moveForward = false;
    private moveBackward = false;
    private moveLeft = false;
    private moveRight = false;
    private moveUp = false;
    private moveDown = false;
    private velocity = new THREE.Vector3();
    private direction = new THREE.Vector3();
    private speed = 100; // Units per second

    constructor(camera: THREE.Camera, domElement: HTMLElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);

        // Click to lock
        domElement.addEventListener('click', () => {
            this.controls.lock();
        });

        // Key listeners
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                this.moveUp = true;
                break;
            case 'ShiftLeft':
                this.moveDown = true;
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
            case 'Space':
                this.moveUp = false;
                break;
            case 'ShiftLeft':
                this.moveDown = false;
                break;
        }
    }

    public update(deltaTime: number) {
        if (this.controls.isLocked) {
            this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
            this.velocity.z -= this.velocity.z * 10.0 * deltaTime;
            this.velocity.y -= this.velocity.y * 10.0 * deltaTime;

            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
            this.direction.y = Number(this.moveUp) - Number(this.moveDown);
            this.direction.normalize();

            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * this.speed * deltaTime;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * this.speed * deltaTime;
            if (this.moveUp || this.moveDown) this.velocity.y += this.direction.y * this.speed * deltaTime;

            this.controls.moveRight(-this.velocity.x * deltaTime);
            this.controls.moveForward(-this.velocity.z * deltaTime);
            this.camera.position.y += this.velocity.y * deltaTime;
        }
    }
}
