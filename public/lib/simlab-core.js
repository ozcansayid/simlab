/* simlab-core.js */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const SimLab = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    params: {},

    initScene: function (options = {}) {
        const defaults = {
            cameraPos: [0, 5, 15],
            ambientIntensity: 0.8,
            directionalIntensity: 1.2,
            grid: true,
            shadows: true
        };
        const config = { ...defaults, ...options };

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(...config.cameraPos);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (config.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.setupLights(config.ambientIntensity, config.directionalIntensity);

        if (config.grid) {
            const grid = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
            this.scene.add(grid);
        }

        window.addEventListener('resize', () => this.onResize());

        // Hide loader
        const loader = document.getElementById('s-loader');
        if (loader) setTimeout(() => loader.style.opacity = '0', 500);

        return { scene: this.scene, camera: this.camera, renderer: this.renderer };
    },

    setupLights: function (ambient, directional) {
        const ambientLight = new THREE.AmbientLight(0xffffff, ambient);
        this.scene.add(ambientLight);

        const sun = new THREE.DirectionalLight(0xffffff, directional);
        sun.position.set(5, 10, 7);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        this.scene.add(sun);
    },

    onResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    handleMessages: function (onUpdate, onInit) {
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type === 'UPDATE_PARAM') {
                this.params[data.key] = data.value;
                if (onUpdate) onUpdate(data.key, data.value);
            } else if (data.type === 'INIT_PARAMS') {
                this.params = { ...this.params, ...data.payload };
                if (onInit) onInit(data.payload);
            }
        });
        window.parent.postMessage({ type: 'SIMULATION_READY' }, '*');
    },

    sendTelemetry: function (data) {
        window.parent.postMessage({ type: 'SIMULATION_TELEMETRY', data }, '*');
    }
};
