import * as THREE from "three";
import "./style.css";
import {
  astroData,
  createAstro,
  createPlanet,
  planetsData,
  createRings,
  type Planet,
} from "./planet";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Escena
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.background = textureLoader.load("/textures/2k_stars_milky_way.jpg");

const planets: Planet[] = planetsData.map((data) => createPlanet(scene, data));

//camara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.set(0, 45, 70);
camera.lookAt(0, 0, 0);

//renderizador para la escena
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 7;
controls.maxDistance = 150;

controls.target.set(0, 0, 0);
controls.update();

//sol
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunMaterial = textureLoader.load("/textures/2k_sun.jpg");
const sun = new THREE.Mesh(
  sunGeometry,
  new THREE.MeshBasicMaterial({ map: sunMaterial }),
);
scene.add(sun);

//Luz del sol desde su angulo
const sunLight = new THREE.PointLight(0xffffff, 200, 200);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

//luz ambiental
const ambientLight = new THREE.AmbientLight(0x334466, 0.15);
scene.add(ambientLight);

const astros: Planet[] = [];

planets.forEach((planet) => {
  const data = astroData[planet.mesh.name] ?? [];

  data.forEach((astroData) => {
    astros.push(createAstro(planet, astroData));
  });
});

//para saturno
const saturn = planets.find((planet) => planet.mesh.name === "Saturno");
if (saturn) {
  createRings(saturn, 2.6, 4.2, "public/textures/2k_saturn_ring_alpha.png");
}

//reloj para el tiempo de las animacioncitas

const clock = new THREE.Clock();

function animate(): void {
  const delta = clock.getDelta();

  sun.rotation.y += delta * 0.15;

  planets.forEach((planet) => {
    planet.orbit.rotation.y += delta * planet.orbitSpeed;
    planet.mesh.rotation.y += delta * planet.rotationSpeed;
  });

  astros.forEach((astro) => {
    astro.orbit.rotation.y += delta * astro.orbitSpeed;
    astro.mesh.rotation.y += delta * astro.rotationSpeed;
  });

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//adaptar escena a la ventana siempre

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
