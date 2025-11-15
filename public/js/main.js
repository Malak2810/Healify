import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('webgl-canvas'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 50;

// Cosmic background with nebula effect
const createCosmicBackground = () => {
    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Nebula clouds
    const nebulaGeometry = new THREE.SphereGeometry(100, 32, 32);
    const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x00d4ff) },
            color2: { value: new THREE.Color(0xa855f7) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                float noise = sin(vPosition.x * 0.1 + time) * cos(vPosition.y * 0.1 + time) * 0.5 + 0.5;
                vec3 color = mix(color1, color2, noise);
                float alpha = noise * 0.3;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const nebula1 = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula1.position.set(-50, 30, -100);
    scene.add(nebula1);

    const nebula2 = new THREE.Mesh(nebulaGeometry.clone(), nebulaMaterial.clone());
    nebula2.position.set(60, -40, -120);
    nebula2.scale.set(1.5, 1.5, 1.5);
    scene.add(nebula2);

    return { stars, nebula1, nebula2 };
};

// Create floating geometric shapes
const createFloatingShapes = () => {
    const shapes = [];

    // Glowing Cube
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-30, 20, -20);
    
    // Add edges for glow effect
    const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
    const cubeLineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00d4ff,
        linewidth: 2
    });
    const cubeLines = new THREE.LineSegments(cubeEdges, cubeLineMaterial);
    cube.add(cubeLines);
    
    scene.add(cube);
    shapes.push({ mesh: cube, rotationSpeed: { x: 0.01, y: 0.01, z: 0.005 } });

    // Glowing Sphere
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xa855f7,
        emissive: 0xa855f7,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(35, -15, -15);
    scene.add(sphere);
    shapes.push({ mesh: sphere, rotationSpeed: { x: 0.005, y: 0.015, z: 0.01 } });

    // Glowing Pyramid
    const pyramidGeometry = new THREE.ConeGeometry(6, 10, 4);
    const pyramidMaterial = new THREE.MeshPhongMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(-25, -25, -25);
    
    const pyramidEdges = new THREE.EdgesGeometry(pyramidGeometry);
    const pyramidLineMaterial = new THREE.LineBasicMaterial({ color: 0xf59e0b });
    const pyramidLines = new THREE.LineSegments(pyramidEdges, pyramidLineMaterial);
    pyramid.add(pyramidLines);
    
    scene.add(pyramid);
    shapes.push({ mesh: pyramid, rotationSpeed: { x: 0.008, y: 0.012, z: 0.006 } });

    // Glowing Torus
    const torusGeometry = new THREE.TorusGeometry(7, 2, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(30, 25, -30);
    scene.add(torus);
    shapes.push({ mesh: torus, rotationSpeed: { x: 0.01, y: 0.008, z: 0.012 } });

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(6);
    const octaMaterial = new THREE.MeshPhongMaterial({
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, -30, -20);
    scene.add(octahedron);
    shapes.push({ mesh: octahedron, rotationSpeed: { x: 0.015, y: 0.01, z: 0.008 } });

    return shapes;
};

// Lighting
const setupLighting = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 100);
    pointLight1.position.set(-30, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 100);
    pointLight2.position.set(30, -20, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf59e0b, 1.5, 100);
    pointLight3.position.set(0, 0, 30);
    scene.add(pointLight3);

    return { pointLight1, pointLight2, pointLight3 };
};

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Initialize scene
const background = createCosmicBackground();
const shapes = createFloatingShapes();
const lights = setupLighting();

// Animation loop
let time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    time += 0.01;

    // Update nebula shader
    if (background.nebula1.material.uniforms) {
        background.nebula1.material.uniforms.time.value = time;
    }
    if (background.nebula2.material.uniforms) {
        background.nebula2.material.uniforms.time.value = time;
    }

    // Rotate stars slowly
    background.stars.rotation.y += 0.0002;
    background.stars.rotation.x += 0.0001;

    // Rotate nebulas
    background.nebula1.rotation.y += 0.0005;
    background.nebula2.rotation.y -= 0.0003;

    // Animate floating shapes
    shapes.forEach((shape, index) => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;

        // Floating animation
        shape.mesh.position.y += Math.sin(time + index) * 0.02;
    });

    // Animate lights
    lights.pointLight1.position.x = Math.sin(time * 0.5) * 30;
    lights.pointLight2.position.x = Math.cos(time * 0.5) * 30;
    lights.pointLight3.intensity = 1.5 + Math.sin(time) * 0.5;

    // Camera follows mouse with smooth interpolation
    targetX = mouseX * 5;
    targetY = mouseY * 5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Hide loading screen after scene is ready
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
}, 2000);

// Export for use in other modules
export { scene, camera, renderer };
