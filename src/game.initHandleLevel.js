const { engineResources } = require("./engine.resources");
const { createShaderProgram } = require("./engine.shader");
const { GameObject } = require("./engine.gameObject");

const initHandleLevel = () => {
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

  /**
   * @type {GameObject}
   */
  const aircraft = resources.gameObjects.aircraft;
  aircraft.mesh = resources.meshes.plane_mock;
  aircraft.material = resources.materials.aircraft;

  /**
   * @type {GameObject}
   */
  const gate01 = resources.gameObjects.gate01;
  gate01.mesh = resources.meshes.gate;
  gate01.material = resources.materials.gate;

  const directLight = resources.gameObjects.directLight;
  const ambientLight = resources.gameObjects.ambientLight;

  // skybox material
  let mat = skybox.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = resources.textures.skybox_color_01;

  // gui elements material
  mat = resources.materials.guiElement;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.useEmission.value = [1];

  // aircraft material
  mat = aircraft.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.uniforms.useColor1.value = [1];
  mat.uniforms.useNormal0.value = [0];
  mat.textures.color0 = resources.textures.test_color;
  mat.textures.color1 = resources.textures.unity;

  // gate material
  mat = gate01.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.useEmission.value = [1];
  mat.uniforms.useColor0.value = [1];
};

exports.initHandleLevel = initHandleLevel;
