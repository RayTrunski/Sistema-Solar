import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  color: number;
  texture: string;
  orbitSpeed: number;
  rotationSpeed: number;
  roughness?: number;
}

export interface Planet {
  mesh: THREE.Mesh;
  orbit: THREE.Group;
  orbitSpeed: number;
  rotationSpeed: number;
}

export interface astroData {
  name: string;
  radius: number;
  distance: number;
  texture: string;
  orbitSpeed: number;
  rotationSpeed: number;
}

export const planetsData: PlanetData[] = [
  {
    name: "Mercurio",
    radius: 0.38,
    distance: 7,
    color: 0xaaaaaa,
    texture: "/textures/2k_mercury.jpg",
    orbitSpeed: 0.48,
    rotationSpeed: 0.2,
  },
  {
    name: "Venus",
    radius: 0.95,
    distance: 10,
    color: 0xd9a066,
    texture: "/textures/2k_venus_surface.jpg",
    orbitSpeed: 0.35,
    rotationSpeed: -0.1,
  },
  {
    name: "Tierra",
    radius: 1,
    distance: 14,
    color: 0x2277ff,
    texture: "/textures/2k_earth_daymap.jpg",
    orbitSpeed: 0.3,
    rotationSpeed: 1.5,
  },
  {
    name: "Marte",
    radius: 0.53,
    distance: 18,
    color: 0xcc4422,
    texture: "/textures/2k_mars.jpg",
    orbitSpeed: 0.24,
    rotationSpeed: 1.4,
  },
  {
    name: "Júpiter",
    radius: 2.5,
    distance: 24,
    color: 0xc88b55,
    texture: "/textures/2k_jupiter.jpg",
    orbitSpeed: 0.13,
    rotationSpeed: 2,
  },
  {
    name: "Saturno",
    radius: 2.1,
    distance: 31,
    color: 0xd8c080,
    texture: "/textures/2k_saturn.jpg",
    orbitSpeed: 0.1,
    rotationSpeed: 1.8,
  },
  {
    name: "Urano",
    radius: 1.5,
    distance: 38,
    color: 0x88ddff,
    texture: "/textures/2k_uranus.jpg",
    orbitSpeed: 0.07,
    rotationSpeed: -1.2,
  },
  {
    name: "Neptuno",
    radius: 1.45,
    distance: 45,
    color: 0x3344dd,
    texture: "/textures/2k_neptune.jpg",
    orbitSpeed: 0.05,
    rotationSpeed: 1.1,
  },
];

export const astroData: Record<string, astroData[]> = {
  Tierra: [
    {
      name: "Luna",
      radius: 0.27,
      distance: 2,
      texture: "/textures/2k_moon.jpg",
      orbitSpeed: 0.5,
      rotationSpeed: 0.1,
    },
  ],

  Júpiter: [
    {
      name: "Ío",
      radius: 0.25,
      distance: 3.2,
      texture: "/textures/Iomap.png",
      orbitSpeed: 1.5,
      rotationSpeed: 0.5,
    },
    {
      name: "Europa",
      radius: 0.22,
      distance: 4,
      texture: "/textures/Europa.jpg",
      orbitSpeed: 1.1,
      rotationSpeed: 0.4,
    },
    {
      name: "Ganímedes",
      radius: 0.35,
      distance: 5,
      texture: "/textures/Ganymede_Reworked.png",
      orbitSpeed: 0.8,
      rotationSpeed: 0.3,
    },
    {
      name: "Calisto",
      radius: 0.32,
      distance: 6,
      texture: "/textures/Callisto-0.jpg",
      orbitSpeed: 0.6,
      rotationSpeed: 0.2,
    },
  ],

  Saturno: [
    {
      name: "Rings",
      radius: 0.1,
      distance: 0,
      texture: "/textures/saturn_ring.png",
      orbitSpeed: 0,
      rotationSpeed: 0,
    },
  ],
};

//funcion para crear las planetas y sus orbitas

export function createPlanet(scene: THREE.Scene, data: PlanetData): Planet {
  const orbit = new THREE.Group();
  scene.add(orbit);

  const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
  const texture = textureLoader.load(data.texture);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: data.roughness ?? 0.8,
    metalness: 0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = data.name;
  mesh.position.x = data.distance;
  orbit.add(mesh);

  const orbitLine = createOrbitLine(data.distance);
  scene.add(orbitLine);

  return {
    mesh,
    orbit,
    orbitSpeed: data.orbitSpeed,
    rotationSpeed: data.rotationSpeed,
  };
}

function createOrbitLine(radius: number): THREE.LineLoop {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < 128; i++) {
    const angle = (i / 128) * Math.PI * 2;

    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x444444,
  });

  return new THREE.LineLoop(geometry, material);
}

export function createAstro(parentPlanet: Planet, data: astroData): Planet {
  const orbit = new THREE.Group();

  orbit.position.copy(parentPlanet.mesh.position);
  parentPlanet.orbit.add(orbit);

  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
  const texture = textureLoader.load(data.texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = data.name;
  mesh.position.x = data.distance;
  orbit.add(mesh);

  orbit.add(createOrbitLine(data.distance));

  return {
    mesh,
    orbit,
    orbitSpeed: data.orbitSpeed,
    rotationSpeed: data.rotationSpeed,
  };
}

export function createRings(
  planet: Planet,
  innerRadius: number,
  outerRadius: number,
  texturePath: string,
): THREE.Mesh {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  const texture = textureLoader.load(texturePath);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 0.8,
  });

  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  planet.mesh.add(ring);

  return ring;
}
