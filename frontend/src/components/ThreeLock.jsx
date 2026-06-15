import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeLock = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 64;
    const height = container.clientHeight || 64;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    // Materials using the brand's Cyber Cyan (0x00f5ff)
    const lockBodyMat = new THREE.MeshPhongMaterial({ color: 0x00f5ff, shininess: 100 });
    const shackleMat = new THREE.MeshPhongMaterial({ color: 0x00f5ff, shininess: 80 });

    // Group to hold the lock parts
    const lockGroup = new THREE.Group();

    // Lock Body (Box)
    const bodyGeom = new THREE.BoxGeometry(2, 1.5, 0.8);
    const lockBody = new THREE.Mesh(bodyGeom, lockBodyMat);
    lockGroup.add(lockBody);

    // Shackle (Torus)
    const shackleGeom = new THREE.TorusGeometry(0.7, 0.15, 16, 32, Math.PI);
    const shackle = new THREE.Mesh(shackleGeom, shackleMat);
    shackle.position.y = 0.75;
    lockGroup.add(shackle);

    // Keyhole detail (Cylinder)
    const keyholeGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
    const keyhole = new THREE.Mesh(keyholeGeom, new THREE.MeshBasicMaterial({ color: 0x080d1d }));
    keyhole.rotation.x = Math.PI / 2;
    keyhole.position.z = 0.4;
    lockGroup.add(keyhole);

    scene.add(lockGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5ff, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      lockGroup.rotation.y += 0.02;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth || 64;
      const newHeight = container.clientHeight || 64;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Clean up geometries and materials
      bodyGeom.dispose();
      shackleGeom.dispose();
      keyholeGeom.dispose();
      lockBodyMat.dispose();
      shackleMat.dispose();
      keyhole.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-16 h-16" />;
};

export default ThreeLock;
