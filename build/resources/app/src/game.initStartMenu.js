const engineResources = require("./engine.resources").Resources();
const { GameObject } = require("./engine.gameObject");
const { createShaderProgram } = require("./engine.shader");
const { Material } = require("./engine.material");

const initStartMenu = () => {
  // prepare shader for materials
  const vsSource = engineResources.getShader("testVS");
  const fsSource = engineResources.getShader("testFS");
  const shaderProgram = createShaderProgram(vsSource, fsSource);

  // bind meshes, materials and shader program

  /**
   *@type {GameObject}
   */
  const concrete = engineResources.getGameObject("concrete");
  concrete.mesh = engineResources.getMesh("concrete_plane");
  concrete.material = engineResources.getMaterial("concrete");

  /**
   *@type {GameObject}
   */
  const flapL = engineResources.getGameObject("flapL");
  flapL.mesh = engineResources.getMesh("flap_L");
  flapL.material = engineResources.getMaterial("aircraft");
  /**
   *@type {GameObject}
   */
  const flapR = engineResources.getGameObject("flapR");
  flapR.mesh = engineResources.getMesh("flap_R");
  flapR.material = engineResources.getMaterial("aircraft");
  /**
   *@type {GameObject}
   */
  const elevatorR = engineResources.getGameObject("elevatorR");
  elevatorR.mesh = engineResources.getMesh("elevator_R");
  elevatorR.material = engineResources.getMaterial("aircraft");
  /**
   *@type {GameObject}
   */
  const elevatorL = engineResources.getGameObject("elevatorL");
  elevatorL.mesh = engineResources.getMesh("elevator_L");
  elevatorL.material = engineResources.getMaterial("aircraft");
  /**
   *@type {GameObject}
   */
  const rudder = engineResources.getGameObject("rudder");
  rudder.mesh = engineResources.getMesh("rudder");
  rudder.material = engineResources.getMaterial("aircraft");
  /**
   *@type {GameObject}
   */
  const propeller = engineResources.getGameObject("propeller");
  propeller.mesh = engineResources.getMesh("propeller");
  propeller.material = engineResources.getMaterial("aircraft");

  /**
   * @type {GameObject}
   */
  const aircraft = engineResources.getGameObject("aircraft");
  aircraft.mesh = engineResources.getMesh("aircraft_body");
  aircraft.material = engineResources.getMaterial("aircraft");
  /**
   * @type {GameObject}
   */
  const spinner = engineResources.getGameObject("spinner");
  spinner.mesh = engineResources.getMesh("spinner");
  spinner.material = engineResources.getMaterial("aircraft");
  /**
   * @type {GameObject}
   */
  const propellerPlane = engineResources.getGameObject("propellerPlane");
  propellerPlane.mesh = engineResources.getMesh("propeller_plane");
  propellerPlane.material = engineResources.getMaterial("propeller");

  // update materials settings and textures
  const ambientLight = engineResources.getAmbientLight();
  const directLight = engineResources.getDirectLight();

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
  mat.textures.color0 = engineResources.getTexture("aircraft_color");
  mat.textures.color1 = engineResources.getTexture("aircraft_decals");

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
  mat.textures.color0 = engineResources.getTexture("concrete01");

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("guiElement");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("guiText");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = engineResources.getTexture("mario");
};

exports.initStartMenu = initStartMenu;
