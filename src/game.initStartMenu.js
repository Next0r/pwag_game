const { engineResources } = require("./engine.resources");
const { GameObject } = require("./engine.gameObject");
const { createShaderProgram } = require("./engine.shader");
const { Material } = require("./engine.material");

const initStartMenu = () => {
  const resources = engineResources;

  // prepare shader for materials
  const vsSource = resources.shaders.testVS;
  const fsSource = resources.shaders.testFS;
  const shaderProgram = createShaderProgram(vsSource, fsSource);

  // bind meshes, materials and shader program

  /**
   *@type {GameObject}
   */
  const concrete = resources.gameObjects.concrete;
  concrete.mesh = resources.meshes.concrete_plane;
  concrete.material = resources.materials.concrete;

  /**
   *@type {GameObject}
   */
  const flapL = resources.gameObjects.flapL;
  flapL.mesh = resources.meshes.flap_L;
  flapL.material = resources.materials.aircraft;
  /**
   *@type {GameObject}
   */
  const flapR = resources.gameObjects.flapR;
  flapR.mesh = resources.meshes.flap_R;
  flapR.material = resources.materials.aircraft;
  /**
   *@type {GameObject}
   */
  const elevatorR = resources.gameObjects.elevatorR;
  elevatorR.mesh = resources.meshes.elevator_R;
  elevatorR.material = resources.materials.aircraft;
  /**
   *@type {GameObject}
   */
  const elevatorL = resources.gameObjects.elevatorL;
  elevatorL.mesh = resources.meshes.elevator_L;
  elevatorL.material = resources.materials.aircraft;
  /**
   *@type {GameObject}
   */
  const rudder = resources.gameObjects.rudder;
  rudder.mesh = resources.meshes.rudder;
  rudder.material = resources.materials.aircraft;
  /**
   *@type {GameObject}
   */
  const propeller = resources.gameObjects.propeller;
  propeller.mesh = resources.meshes.propeller;
  propeller.material = resources.materials.aircraft;

  /**
   * @type {GameObject}
   */
  const aircraft = resources.gameObjects.aircraft;
  aircraft.mesh = resources.meshes.aircraft_body;
  aircraft.material = resources.materials.aircraft;
  /**
   * @type {GameObject}
   */
  const spinner = resources.gameObjects.spinner;
  spinner.mesh = resources.meshes.spinner;
  spinner.material = resources.materials.aircraft;
  /**
   * @type {GameObject}
   */
  const propellerPlane = resources.gameObjects.propellerPlane;
  propellerPlane.mesh = resources.meshes.propeller_plane;
  propellerPlane.material = resources.materials.propeller;

  // update materials settings and textures
  const ambientLight = resources.gameObjects.ambientLight;
  const directLight = resources.gameObjects.directLight;

  let mat = aircraft.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.uniforms.useColor1.value = [1];
  mat.uniforms.useNormal0.value = [0];
  mat.textures.color0 = resources.textures.aircraft_color;
  mat.textures.color1 = resources.textures.aircraft_decals;

  /**
   * @type {Material}
   */
  mat = concrete.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.uniforms.mapTilingX.value = [5];
  mat.uniforms.mapTilingY.value = [5];
  mat.textures.color0 = resources.textures.concrete01;

  /**
   * @type {Material}
   */
  mat = resources.materials.guiElement;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];

  /**
   * @type {Material}
   */
  mat = resources.materials.guiText;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.mario;
};

exports.initStartMenu = initStartMenu;
