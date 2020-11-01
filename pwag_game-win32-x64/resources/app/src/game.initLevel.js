const { engineResources } = require("./engine.resources");
const { createShaderProgram } = require("./engine.shader");
const { GameObject } = require("./engine.gameObject");
const { Material } = require("./engine.material");

const initLevel = () => {
  const resources = engineResources;

  const vsSource = resources.shaders.testVS;
  const fsSource = resources.shaders.testFS;

  const shaderProgram = createShaderProgram(vsSource, fsSource);

  const camera = resources.gameObjects.camera;
  camera.projection.far = 1000;

  /**
   * @type {GameObject}
   */
  const skybox = resources.gameObjects.skybox;
  skybox.mesh = resources.meshes.skybox;
  skybox.material = resources.materials.skybox;

  const directLight = resources.gameObjects.directLight;
  const ambientLight = resources.gameObjects.ambientLight;

  // skybox material
  let mat = skybox.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.skybox_color_01;

  // gui elements material
  mat = resources.materials.guiElement;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];

  // aircraft material
  mat = resources.materials.aircraft;
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

  // gate material
  mat = resources.materials.gate;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.textures.color0 = resources.textures.gate_color;

  /**
   * @type {Material}
   */
  mat = resources.materials.gate_lamps_off;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.uniforms.mapOffsetY.value = [-0.5];
  mat.textures.color0 = resources.textures.lamp_sign_color;

  /**
   * @type {Material}
   */
  mat = resources.materials.gate_lamps_on;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.lamp_sign_color;

  /**
   * @type {Material}
   */
  mat = resources.materials.water;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.water_color;

  /**
   * @type {Material}
   */
  mat = resources.materials.propeller;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.propeller;
};

exports.initLevel = initLevel;
