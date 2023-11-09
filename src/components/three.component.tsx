import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

type Vector3Tuple = [number, number, number];

type ShapeData = {
  type: "prism" | "sphere";
  size?: Vector3Tuple;
  radius?: number;
  color: number;
  bezier: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
  zRotation?: number;
};

const ThreeLogoRepresentation = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [displayedWord, setDisplayedWord] = useState<string>("CREATIX");
  const [animateOut, setAnimateOut] = useState<boolean>(false);

  useEffect(() => {
    const word = "CREATIX";
    const wordArray = word.split("");
    setLetters(wordArray);

    // Setup common to all prisms
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default is PCFShadowMap

    const container = document.getElementById("three-container")!;
    container.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Adding ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(ambientLight);

    // Adding soft directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 1, 1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024; // default is 512
    dirLight.shadow.mapSize.height = 1024; // default is 512
    scene.add(dirLight);

    // Create a radial gradient background
    const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

    const fragmentShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec3 fgColor = vec3(1.0);
    vec3 bgColor = vec3(0.8, 0.8, 0.8);
    float radial = length(vWorldPosition.xy) / 200.0;
    gl_FragColor = vec4(mix(fgColor, bgColor, radial), 1.0);
  }
`;

    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    });

    const backgroundSphere = new THREE.Mesh(
      new THREE.SphereGeometry(500, 32, 32),
      backgroundMaterial,
    );

    backgroundSphere.receiveShadow = true;

    backgroundSphere.material.side = THREE.BackSide;
    scene.add(backgroundSphere);

    // Function to initialize a prism
    const initPrism = (
      width: number,
      height: number,
      depth: number,
      color: number,
      initialPosition: THREE.Vector3,
    ): THREE.Mesh => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color });
      material.color.convertSRGBToLinear();
      const cube = new THREE.Mesh(geometry, material);
      cube.rotation.y = Math.PI / 2;
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z,
      );

      scene.add(cube);
      return cube;
    };

    const initSphere = (
      radius: number,
      color: number,
      initialPosition: THREE.Vector3,
    ): THREE.Mesh => {
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.2,
      });
      material.color.convertSRGBToLinear();
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z,
      );

      scene.add(sphere);
      return sphere;
    };

    // Function to animate a prism
    const animatePrism = (
      prism: THREE.Mesh,
      p0: THREE.Vector3,
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      zRotation: number,
      onComplete: () => void,
    ): void => {
      const gsapTarget = { t: 0 };

      gsap.to(gsapTarget, {
        duration: 1.2,
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

          if (zRotation !== undefined) {
            prism.rotation.z += zRotation;
          }
        },
        onComplete,
      });
    };

    const timer = setTimeout(() => {
      setAnimateOut(true);

      setTimeout(() => {
        setDisplayedWord("UNDER CONSTRUCTION");
        setAnimateOut(false);
      }, 2000);
    }, 4000 + 1400);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const shapesData: ShapeData[] = [
      {
        type: "prism",
        size: [0.1, 0.1, 1.8],
        color: 0xffffff,
        bezier: [
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(-3, 5, 0),
          new THREE.Vector3(-2, 0, 0),
        ],
      },
      {
        type: "prism",
        size: [0.07, 0.07, 1.4],
        color: 0xffffff,
        bezier: [
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(-3, 5, 0),
          new THREE.Vector3(-1, 0.4, 0),
        ],
      },
      {
        type: "prism",
        size: [0.1, 0.1, 2.2],
        color: 0xffffff,
        bezier: [
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(-3, 5, 0),
          new THREE.Vector3(-2, 0.8, 0),
        ],
      },
      {
        type: "sphere",
        radius: 0.5, // radius of the sphere
        color: 0x1fe0ca, // color in hexadecimal
        bezier: [
          new THREE.Vector3(0, 5, 0), // start point
          new THREE.Vector3(3, 5, 0), // control point
          new THREE.Vector3(-2.5, 2, 0), // end point
        ],
        zRotation: 0.05, // optional z-axis rotation
      },
      {
        type: "sphere",
        radius: 0.1, // radius of the sphere
        color: 0xdb525c, // color in hexadecimal
        bezier: [
          new THREE.Vector3(0, 5, 0), // start point
          new THREE.Vector3(3, 5, 0), // control point
          new THREE.Vector3(-1.5, 1.3, 0), // end point
        ],
        zRotation: 0.05, // optional z-axis rotation
      },

      // ... add more shapes (prisms or spheres) here
    ];

    // Recursive function to animate prisms in sequence
    const animateShapesInSequence = (index: number) => {
      if (index >= shapesData.length) return;
      const { type, size, radius, color, bezier, zRotation } =
        shapesData[index]!;

      let shape: THREE.Mesh;
      if (type === "prism" && size) {
        shape = initPrism(size[0], size[1], size[2], color, bezier[0]);
      } else if (type === "sphere" && radius) {
        shape = initSphere(radius, color, bezier[0]);
      } else {
        console.error("Invalid shape data");
        return;
      }

      animatePrism(
        shape,
        bezier[0],
        bezier[1],
        bezier[2],
        zRotation ? zRotation : 0,
        () => animateShapesInSequence(index + 1),
      );
    };

    // Start the animation sequence
    animateShapesInSequence(0);

    animate();

    return () => {
      clearTimeout(timer); // Clean up the timer when the component unmounts or the word changes
    };
  }, []);

  const renderLetters = () => {
    return letters.map((letter, index) => (
      <span
        key={index}
        className={`letter ${animateOut ? "fadeOut" : "fadeIn"}`}
        style={{
          animation: `slideIn 1s ease-out ${index * 0.2}s forwards`,
        }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <div className="parent-container">
      <div id="three-container" className="three-canvas"></div>
      <div className="overlay">
        <h1
          className={`absolute left-[45rem] top-[33rem] flex justify-start bg-transparent font-roboto text-7xl text-gray-400 drop-shadow-xl ${
            animateOut ? "fadeOut" : ""
          }`}
        >
          {displayedWord === "CREATIX" ? renderLetters() : displayedWord}
        </h1>
      </div>
    </div>
  );
};

export default ThreeLogoRepresentation;
