import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui'

const gui = new GUI()
const moonLightFolder = gui.addFolder('Moon light')
const doorLightFolder = gui.addFolder('Door light')

THREE.ColorManagement.enabled = false

// scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader();

gltfLoader.load(
	// resource URL
	'/models/bmw/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

    gltf.scene.position.set(0, 0, 7)
    gltf.scene.rotation.y = Math.PI
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh)
        node.material.metalness = 0
    })
    scene.add(gltf.scene);

	}
);

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksAoTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const roofColorTexture = textureLoader.load('/textures/roof/color.jpg')
const roofNormalTexture = textureLoader.load('/textures/roof/normal.exr')
const roofRoughnessTexture = textureLoader.load('/textures/roof/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassHeightTexture = textureLoader.load('/textures/grass/height.png')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.exr')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.exr')

// camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 5
camera.position.y = 5
camera.position.z = 5
scene.add(camera)

// ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.3)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)
moonLightFolder.add(moonLight.position, 'x', -5, 5)
moonLightFolder.add(moonLight.position, 'y', -5, 5)
moonLightFolder.add(moonLight.position, 'z', -5, 5)
moonLightFolder.add(moonLight.rotation, 'x', -5, 5)
moonLightFolder.add(moonLight.rotation, 'y', -5, 5)
moonLightFolder.add(moonLight.rotation, 'z', -5, 5)

const directionalLightHelper = new THREE.DirectionalLightHelper(moonLight)
scene.add(directionalLightHelper)

// Door Light
const doorLight = new THREE.PointLight('#e67e22', 1, 12)
doorLight.position.set(0, 2.2, 2.7)
scene.add(doorLight)
doorLightFolder.add(doorLight.position, 'x', -5, 5)
doorLightFolder.add(doorLight.position, 'y', -5, 5)
doorLightFolder.add(doorLight.position, 'z', -5, 5)
doorLightFolder.add(doorLight.rotation, 'x', -5, 5)
doorLightFolder.add(doorLight.rotation, 'y', -5, 5)
doorLightFolder.add(doorLight.rotation, 'z', -5, 5)

const doorLightHelper = new THREE.PointLightHelper(doorLight)
scene.add(doorLightHelper)

grassColorTexture.repeat.set(3,3)
grassHeightTexture.repeat.set(3,3)
grassNormalTexture.repeat.set(3,3)
grassRoughnessTexture.repeat.set(3, 3)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassHeightTexture.wrapS = THREE.RepeatWrapping
grassHeightTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

// ground
const planeGeometry = new THREE.PlaneGeometry(20, 20)
const ground = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: grassColorTexture,
    displacementMap: grassHeightTexture,
    displacementScale: 0.1,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  }),
)
ground.rotation.x = - Math.PI * 0.5
scene.add(ground)

// house
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAoTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
  })
)
walls.position.y = 2.5 / 2
house.add(walls)

roofColorTexture.repeat.set(3,3)
roofRoughnessTexture.repeat.set(3, 3)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofRoughnessTexture.wrapS = THREE.RepeatWrapping

roofColorTexture.wrapT = THREE.RepeatWrapping
roofRoughnessTexture.wrapT = THREE.RepeatWrapping
// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4, 1, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    roughnessMap: roofRoughnessTexture,
    normalMap: roofNormalTexture
  })
)
roof.position.y = 2.5 + (1 / 2)
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAoTexture,
    map: doorColorTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.position.z = 2 + 0.01
door.position.y = 0.9
house.add(door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#103B1D' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.x = 1.5
bush1.position.z = 2.5

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.x = 1
bush2.position.z = 2.5

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.5, 0.5, 0.5)
bush3.position.y = -0.1
bush3.position.x = -1.5
bush3.position.z = 2.5

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.4, 0.4, 0.4)
bush4.position.y = -0.2
bush4.position.x = -1
bush4.position.z = 2.5

house.add(bush1, bush2, bush3, bush4)

// graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#B1B3C2' })

for (let i = 0; i < 50; i++) {

  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 6
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)                              
  // scene.add(grave)
}

// canvas
const canvas = document.querySelector('canvas.webgl')

if (canvas) {

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLElement })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)
  renderer.shadowMap.enabled = true

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)

  const tick = () => {
    requestAnimationFrame(tick)

    controls.update()

    renderer.render(scene, camera)
  }

  tick()
}