//declaring globals
let json,
  camera,
  scene,
  renderer,
  mesh,
  groupGeometry,
  controls,
  //All zero or false height values will be ignored
  fast = false,
  width = window.innerWidth,
  height = window.innerHeight;

// loading json file
$(document).ready(function () {
  console.log("start loading");
  $.getJSON(jsonFile, function (data) {
    console.log("loading complete");
    json = data;
    init();
  });
});

// here we initialize the scene with camera and renderer
function init() {
  //Initiate THREE.js
  // camera
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 3000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 70;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd6f1fb);
  scene.fog = new THREE.FogExp2(scene.background, 0.005);

  //Initiate Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // CONTROLS FOR NAVIGATION https://threejs.org/examples/?q=controls#misc_controls_drag
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  //This group will hold all geometries
  groupGeometry = new THREE.BufferGeometry();

  console.log("initiation done");

  //Lets go and build the objects based on the geoJson data
  buildShape();

  // FLOOR
  const planeGeometry = new THREE.PlaneGeometry(1500, 1500);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x426882, depthWrite: false });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  // rotate and translate position to imitate a floor
  planeMesh.rotation.x = -Math.PI / 2;
  planeMesh.position.y = -50;
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
}

//Due to javascripts limitations we need to parse the data in subsets (5000)
var shapeCount = 0,
  shapes = [],
  subset_size = 5000;

function buildShape() {
  console.log("buildShape (" + shapeCount + "/" + json.features.length + ")");
  if (shapeCount < json.features.length) {
    var shapeSession = 0;
    for (var s = shapeCount; s < json.features.length && shapeSession < subset_size; s++) {
      shapeSession++;
      shapeCount++;
      var good = true;
      var points = [];
      //Check if the geometry has at least two coordinates
      if (
        json.features[s].geometry.coordinates.length < 1 ||
        json.features[s].geometry.coordinates[0] < 1
      ) {
        good = false;
      } else {
        for (var i = 0; i < json.features[s].geometry.coordinates[0].length; i++) {
          //Check for weird values
          if (
            json.features[s].geometry.coordinates[0][i][0] &&
            json.features[s].geometry.coordinates[0][i][1] &&
            json.features[s].geometry.coordinates[0][i][0] > 0 &&
            json.features[s].geometry.coordinates[0][i][1] > 0
          ) {
            points.push(
              new THREE.Vector2(
                translateLat(json.features[s].geometry.coordinates[0][i][0]),
                translateLng(json.features[s].geometry.coordinates[0][i][1])
              )
            );
          } else {
            good = false;
          }
        }
      }

      //If the geometry is safe, continue
      if (good) {
        //Calculate the height of the current geometry for extrusion when we have volume data
      }

      //If the geometry is still safe, continue
      if (good) {
        addShape(new THREE.Shape(points));
      }
    }

    //If we have more geometries to add restart the whole loop
    setTimeout(function () {
      buildShape();
    }, 100);
  } else {
    //We are done building our geometry
    console.log("Geometry Done");

    // LIGHTING
    // AMBIENT
    const lightColor = 0xffffff;
    const lightIntensity = 0.8;
    const ambientLight = new THREE.AmbientLight(lightColor, lightIntensity);
    // add the ambient light to the scene
    scene.add(ambientLight);

    // POINTLIGHT
    const lightColorPoint = 0xffffff;
    const lightIntensityPoint = 0.5;
    const pointLight = new THREE.PointLight(lightColorPoint, lightIntensityPoint);
    pointLight.position.set(0, 50, 50);

    // shadow settings
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 600;
    pointLight.shadow.radius = 10;

    // adding mesh of light to see its position
    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // add the point light helper to the scene
    scene.add(pointLightHelper);

    // add the point light to the scene
    scene.add(pointLight);

    //Now add the renderer to the DOM
    document.body.appendChild(renderer.domElement);

    //And start animating it
    console.log("animate");
    requestAnimationFrame(animate);
  }
}

//Adding geometries to scene
function addShape(shape) {
  const extrudeSettings = {
    steps: 1,
    depth: 1.1,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  //Create the geometry
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  let material = new THREE.MeshPhongMaterial({ color: 0x0231bd, wireframe: false });

  let lakeShape = new THREE.Mesh(geometry, material);
  lakeShape.castShadow = true;
  // lakeShape.rotation.x = -Math.PI / 2;
  scene.add(lakeShape);
}

// make sure the scene adjusts to the browser window size
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  // recursive clock for animation
  requestAnimationFrame(animate);

  //Render the scene
  renderer.render(scene, camera);

  // update camera position
  controls.update();
}
