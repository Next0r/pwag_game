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
  const aircraft = resources.gameObjects.startMenuAircraft;
  aircraft.mesh = resources.meshes.startMenuAircraft;
  aircraft.material = resources.materials.aircraft;

  /**
   *@type {GameObject}
   */
  const concrete = resources.gameObjects.concrete;
  concrete.mesh = resources.meshes.concrete_plane;
  concrete.material = resources.materials.concrete;

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
  mat.textures.color0 = resources.textures.test_color;
  mat.textures.color1 = resources.textures.unity;

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
