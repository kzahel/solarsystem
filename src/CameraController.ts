import * as THREE from 'three';

export class CameraController {
    private camera: THREE.Camera;
    private domElement: HTMLElement;
    private isLocked = false;

    // Movement state
    private moveForward = false;
    private moveBackward = false;
    private moveLeft = false;
    private moveRight = false;
    private moveUp = false;
    private moveDown = false;
    private rollLeft = false;
    private rollRight = false;

    // Physics/Speed
    private velocity = new THREE.Vector3();
    private speed = 100; // Units per second
    private rollSpeed = 2.0; // Radians per second

    constructor(camera: THREE.Camera, domElement: HTMLElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Click to lock
        domElement.addEventListener('click', () => {
            if (!this.isLocked) {
                this.domElement.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement === this.domElement;
        });

        // Mouse Look
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));

        // Key listeners
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.isLocked) return;

        const sensitivity = 0.002;

        // Yaw (Left/Right) - Rotate around local Y
        // The user complained about "roll" when moving left/right. 
        // In standard FPS, Yaw is World Y. In 6DOF space, Yaw is Local Y.
        // If we allow Roll (Q/E), we MUST use Local Y for Yaw, otherwise it feels weird when rolled.
        this.camera.rotateY(-event.movementX * sensitivity);

        // Pitch (Up/Down) - Rotate around local X
        this.camera.rotateX(-event.movementY * sensitivity);
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': this.moveForward = true; break;
            case 'ArrowLeft':
            case 'KeyA': this.moveLeft = true; break;
            case 'ArrowDown':
            case 'KeyS': this.moveBackward = true; break;
            case 'ArrowRight':
            case 'KeyD': this.moveRight = true; break;
            case 'Space': this.moveUp = true; break;
            case 'ShiftLeft': this.moveDown = true; break;
            case 'KeyQ': this.rollLeft = true; break;
            case 'KeyE': this.rollRight = true; break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': this.moveForward = false; break;
            case 'ArrowLeft':
            case 'KeyA': this.moveLeft = false; break;
            case 'ArrowDown':
            case 'KeyS': this.moveBackward = false; break;
            case 'ArrowRight':
            case 'KeyD': this.moveRight = false; break;
            case 'Space': this.moveUp = false; break;
            case 'ShiftLeft': this.moveDown = false; break;
            case 'KeyQ': this.rollLeft = false; break;
            case 'KeyE': this.rollRight = false; break;
        }
    }

    public update(deltaTime: number) {
        if (!this.isLocked) return;

        // 1. Handle Roll
        if (this.rollLeft) this.camera.rotateZ(this.rollSpeed * deltaTime);
        if (this.rollRight) this.camera.rotateZ(-this.rollSpeed * deltaTime);

        // 2. Handle Movement
        // We want movement to be relative to the camera's orientation
        const moveDir = new THREE.Vector3();

        if (this.moveForward) moveDir.z -= 1;
        if (this.moveBackward) moveDir.z += 1;
        if (this.moveLeft) moveDir.x -= 1;
        if (this.moveRight) moveDir.x += 1;
        if (this.moveUp) moveDir.y += 1;
        if (this.moveDown) moveDir.y -= 1;

        moveDir.normalize();

        // Apply speed
        // Translate moves relative to object's local space
        this.camera.translateX(moveDir.x * this.speed * deltaTime);
        this.camera.translateY(moveDir.y * this.speed * deltaTime);
        this.camera.translateZ(moveDir.z * this.speed * deltaTime);
    }
}
