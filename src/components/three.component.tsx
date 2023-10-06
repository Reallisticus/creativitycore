import React, { useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
type Vector3Tuple = [number, number, number];

const ThreeLogoRepresentation = () => {
  useEffect(() => {
    // Setup common to all prisms
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Adding light
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Function to initialize a prism
    const initPrism = (
      width: number,
      height: number,
      depth: number,
      color: number,
    ): THREE.Mesh => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      return cube;
    };

    // Function to animate a prism
    const animatePrism = (
      prism: THREE.Mesh,
      p0: THREE.Vector3,
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      onComplete: () => void,
    ): void => {
      const gsapTarget = { t: 0 };

      gsap.to(gsapTarget, {
        duration: 2,
        t: 1,
        ease: "power2.out",
        onUpdate: () => {
          const t = gsapTarget.t;
          const x =
            (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
          const y =
            (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
          const z =
            (1 - t) ** 2 * p0.z + 2 * (1 - t) * t * p1.z + t ** 2 * p2.z;
          prism.position.set(x, y, z);
        },
        onComplete,
      });
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const prismsData: {
      size: Vector3Tuple;
      color: number;
      bezier: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
    }[] = [
      {
        size: [0.2, 0.2, 2] as Vector3Tuple,
        color: 0x00ff00,
        bezier: [
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(-3, 5, 0),
          new THREE.Vector3(-2, 0, 0),
        ],
      },
      {
        size: [0.2, 0.2, 2] as Vector3Tuple,
        color: 0x00ff00,
        bezier: [
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(-3, 5, 0),
          new THREE.Vector3(-2, 0, 0),
        ],
      },
      // Add more prism data here...
    ];

    // Recursive function to animate prisms in sequence
    const animatePrismsInSequence = (index: number) => {
      if (index >= prismsData.length) return;
      const { size, color, bezier } = prismsData[index]!;

      // Explicitly pass the arguments
      const prism = initPrism(size[0], size[1], size[2], color);

      // Explicitly pass the arguments
      animatePrism(prism, bezier[0], bezier[1], bezier[2], () =>
        animatePrismsInSequence(index + 1),
      );
    };

    // Start the animation sequence
    animatePrismsInSequence(0);

    animate();
  }, []);

  return <div className="bg-white"></div>;
};

export default ThreeLogoRepresentation;
