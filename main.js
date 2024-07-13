import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import "./style.css";
import nebula from '/img/nebula.jpg';
import Stats from 'stats.js';


/*Stats JS*/
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom).style.left = "100px";

var stats2 = new Stats();
stats2.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats2.dom)



function animate() {

  stats.begin();
  stats2.begin();


  stats.end();
  stats2.end();

  requestAnimationFrame(animate);

}

requestAnimationFrame(animate);


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

let clock = new THREE.Clock();


/** */
const lightHTML = document.querySelector(".light-valuex")
const lightHTMLy = document.querySelector(".light-valuey")
const lightHTMLz = document.querySelector(".light-valuez")


//SPHERE //////////////////////////////////////////////////////////////
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  wireframe: true,
  roughness: 0.2,
})

//Tree GLTF

const gltfLoader = new GLTFLoader();
let model;
gltfLoader.load('public/sceneNoLight.gltf', function (gltf) {
  model = gltf.scene
  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      //if (node.material.map) node.material.map.anisotropy = 16;   Not needed Probably
    }
  });
  model.position.setX(-8)
  model.position.setZ(-2)

  scene.add(model);
}
)

/**HELMET GLTF */

const gtlfLoaderHelmet = new GLTFLoader();
let helmet;
gtlfLoaderHelmet.load('public/helmet/scene.gltf', function (gltf) {
  helmet = gltf.scene
  helmet.traverse(function (helmetNode) {
    if (helmetNode.isMesh) {
      helmetNode.castShadow = true;
      helmetNode.receiveShadow = true;
    }
  })
  helmet.scale.x = 2
  helmet.scale.y = 2
  helmet.scale.z = 2
  helmet.position.setZ(9)
  scene.add(helmet)
})

/************************************************** */

/**SWORD GLTFF */

const gltfLoaderSword = new GLTFLoader();
let sword;

gltfLoaderSword.load('public/artorias_sword/scene.gltf', function (gltf) {
  sword = gltf.scene;
  sword.traverse(function (swordNode) {
    if (swordNode.isMesh) {
      swordNode.castShadow = true;
      swordNode.receiveShadow = true;
    }
  })
  sword.scale.x = 0.5;
  sword.scale.y = 0.5;
  sword.scale.z = 0.5;

  sword.position.setX(6.5)
  sword.position.setY(6.5)
  sword.position.setZ(13)
  scene.add(sword)
})

/************************************************** */

const gltfLoaderPh = new GLTFLoader();
let pg;

gltfLoaderPh.load('public/artorias/scene.gltf', function (gltf) {
  pg = gltf.scene;
  pg.traverse(function (pgNode) {
    if (pgNode.isMesh) {
      console.log(pgNode)
      pgNode.castShadow = true
      pgNode.receiveShadow = true
    }
  })

  pg.scale.x = 0.005;
  pg.scale.y = 0.005;
  pg.scale.z = 0.005;

  pg.position.y = 0.3;

  scene.add(pg)


})


/**Phoenix */

const gltfLoaderPhoenix = new GLTFLoader();

let phoenix;
let mixer;

gltfLoaderPhoenix.load('public/phoenix/scene.gltf', function (gltf) {
  phoenix = gltf.scene;


  phoenix.traverse(function (phoenixNode) {
    if (phoenixNode.isMesh) {
      phoenixNode.castShadow = true,
        phoenixNode.receiveShadow = true
    }
  })

  mixer = new THREE.AnimationMixer(gltf.scene);
  let actionMove = mixer.clipAction(gltf.animations[0]);
  console.log(actionMove)

  phoenix.scale.x = 0.010
  phoenix.scale.y = 0.010
  phoenix.scale.z = 0.010

  phoenix.position.z = 12
  phoenix.position.x = -10
  phoenix.position.y = 3






  scene.add(phoenix)

  actionMove.play()

  /**PS. mixer.update() is what makes the animation switch to the next obj
   * i called it in the loop function as it needs to be constantly updated
   * and used THREE.Clock() => getDelta to get it going.
  */




})

//StandardMaterial MESH is affected by lightning,  while the BasicMaterial does not get the lightning effect.

const geometryPlane = new THREE.PlaneGeometry(60, 60);
const materialPlane = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });

geometryPlane.dispose();


const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 3
mesh.position.x = 6
mesh.position.z = -7

const plane = new THREE.Mesh(geometryPlane, materialPlane);
scene.add(mesh);
mesh.castShadow = true;
scene.add(plane);
plane.rotateX(-0.5 * Math.PI)
plane.receiveShadow = true;



const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 70, 100);
light.updateMatrix();
light.position.set(0, 10, 10)
light.intensity = 100;
light.castShadow = true;

/**CAST ON LIGHT TO POLISH THE SHADOWS! TRY TO SET the mapSize to 0 and see the changes.  I dont get what bias do. */
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024 * 4;
light.shadow.mapSize.height = 1024 * 4;
scene.add(light);
light.dispose();



//Camera

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);



//GRID HELPER
const gridHelper = new THREE.GridHelper(60, 60);
scene.add(gridHelper)

//POINT LIGHT HELPER

const lightHelper = new THREE.PointLightHelper(light, 3);
scene.add(lightHelper);

const lightShadowHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(lightShadowHelper)


//TEXTURE LOADER

const texture = new THREE.TextureLoader();
scene.background = texture.load(nebula);

//render

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera)
renderer.setPixelRatio(2)

//Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
//controls.enableZoom = false
controls.autoRotate = true;
controls.autoRotateSpeed = 0

//Resize based on the window size (Responsive)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera);
  lightHTML.innerHTML = camera.position.x
  lightHTMLy.innerHTML = camera.position.y
  lightHTMLz.innerHTML = camera.position.z

  if (mixer) {
    mixer.update(clock.getDelta())
  }

  window.requestAnimationFrame(loop);
}
loop();


const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })


let mouseDown = false;
let rgb = [];


window.addEventListener("mousedown", () => {
  mouseDown = true;
})

window.addEventListener("mouseup", () => {
  mouseDown = false;
})

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color,
      {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      })

  }
  //console.log(rgb)
})


//GUI

const gui = new GUI();

//GUI CONFIG 

gui.add(mesh.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis');
gui.add(mesh.rotation, 'y', 0, Math.PI * 2).name('Rotate y Axis');
gui.add(mesh.scale, 'x', 0, 2).name('Scale X Axis');
gui.add(mesh.material, 'wireframe');
gui.add(light.position, 'x', -40, 40).name('Light X Axis');
gui.add(light.position, 'y', -40, 40).name('Light Y Axis');
gui.add(light.position, 'z', -40, 40).name('Light Z Axis');