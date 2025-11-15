import * as THREE from 'three';

class HolographicGlobe {
    constructor() {
        this.container = document.getElementById('globe-container');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
        this.createGlobe();
        this.createDataNodes();
        this.setupLighting();
        this.setupInteraction();
        this.animate();
    }

    init() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 300;
    }

    createGlobe() {
        // Main globe sphere
        const globeGeometry = new THREE.SphereGeometry(80, 64, 64);
        
        // Holographic shader material
        const globeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x00d4ff) },
                color2: { value: new THREE.Color(0xa855f7) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    // Fresnel effect for holographic look
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
                    
                    // Animated scan lines
                    float scanLine = sin(vUv.y * 50.0 + time * 2.0) * 0.5 + 0.5;
                    
                    // Grid pattern
                    float gridX = step(0.95, fract(vUv.x * 20.0));
                    float gridY = step(0.95, fract(vUv.y * 20.0));
                    float grid = max(gridX, gridY);
                    
                    // Color mixing
                    vec3 color = mix(color1, color2, vUv.y);
                    color = mix(color, vec3(1.0), grid * 0.3);
                    color = mix(color, vec3(1.0), scanLine * 0.1);
                    
                    // Final color with fresnel
                    float alpha = fresnel * 0.6 + grid * 0.4 + scanLine * 0.2;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.scene.add(this.globe);

        // Wireframe overlay
        const wireframeGeometry = new THREE.SphereGeometry(81, 32, 32);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        this.scene.add(this.wireframe);

        // Inner glow sphere
        const glowGeometry = new THREE.SphereGeometry(75, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
    }

    createDataNodes() {
        this.dataNodes = [];
        const nodeCount = 50;

        for (let i = 0; i < nodeCount; i++) {
            // Random position on sphere surface
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;

            const x = 82 * Math.cos(theta) * Math.sin(phi);
            const y = 82 * Math.sin(theta) * Math.sin(phi);
            const z = 82 * Math.cos(phi);

            // Create node
            const nodeGeometry = new THREE.SphereGeometry(1.5, 16, 16);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x00d4ff : 0xa855f7,
                transparent: true,
                opacity: 0.8
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(x, y, z);

            // Add glow
            const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: nodeMaterial.color,
                transparent: true,
                opacity: 0.3
            });
            const nodeGlow = new THREE.Mesh(glowGeometry, glowMaterial);
            node.add(nodeGlow);

            this.scene.add(node);
            this.dataNodes.push({
                mesh: node,
                originalScale: 1,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });

            // Create connections between nearby nodes
            if (i > 0 && Math.random() > 0.7) {
                const prevNode = this.dataNodes[Math.floor(Math.random() * this.dataNodes.length)];
                const points = [
                    node.position,
                    prevNode.mesh.position
                ];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x00d4ff,
                    transparent: true,
                    opacity: 0.2
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
            }
        }
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 300);
        pointLight1.position.set(100, 100, 100);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xa855f7, 2, 300);
        pointLight2.position.set(-100, -100, 100);
        this.scene.add(pointLight2);
    }

    setupInteraction() {
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isHovering = false;

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            this.isHovering = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });

        this.container.addEventListener('click', () => {
            // Zoom animation on click
            this.zoomIn = !this.zoomIn;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Update shader uniforms
        if (this.globe.material.uniforms) {
            this.globe.material.uniforms.time.value = time;
        }

        // Rotate globe
        if (this.isHovering) {
            this.targetRotation.y = this.mouse.x * 0.5;
            this.targetRotation.x = this.mouse.y * 0.5;
        } else {
            this.targetRotation.y += 0.002;
        }

        this.globe.rotation.y += (this.targetRotation.y - this.globe.rotation.y) * 0.05;
        this.globe.rotation.x += (this.targetRotation.x - this.globe.rotation.x) * 0.05;
        this.wireframe.rotation.y = this.globe.rotation.y;
        this.wireframe.rotation.x = this.globe.rotation.x;

        // Animate data nodes
        this.dataNodes.forEach((node, index) => {
            const pulse = Math.sin(time * 2 + index) * 0.3 + 1;
            node.mesh.scale.setScalar(pulse);
            
            // Rotate nodes with globe
            node.mesh.rotation.y = this.globe.rotation.y;
            node.mesh.rotation.x = this.globe.rotation.x;
        });

        // Zoom effect
        if (this.zoomIn) {
            this.camera.position.z += (200 - this.camera.position.z) * 0.05;
        } else {
            this.camera.position.z += (300 - this.camera.position.z) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HolographicGlobe();
    });
} else {
    new HolographicGlobe();
}

export default HolographicGlobe;
