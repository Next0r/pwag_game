const { CreateEngineResources } = require("./engine.resources");
const { createShaderProgram } = require("./engine.shader");
const { GameObject } = require("./engine.gameObject");

const gameInit = () => {
  const resources = CreateEngineResources();

  // bind mesh and materials to game objects
  const guiSight = resources.gameObjects.guiSight;
  guiSight.mesh = resources.meshes.guiPlane;
  guiSight.material = resources.materials.guiSight;

  const skybox = resources.gameObjects.skybox;
  skybox.mesh = resources.meshes.skybox;
  skybox.material = resources.materials.skybox;

  /**
   * @type {GameObject}
   */
  const plane = resources.gameObjects.plane;
  plane.mesh = resources.meshes.plane_mock;
  plane.material = resources.materials.plane;

  const box = resources.gameObjects.box;
  box.mesh = resources.meshes.box2;
  box.material = resources.materials.plane;

  const box2 = resources.gameObjects.box2;
  box2.mesh = resources.meshes.box2;
  box2.material = resources.materials.plane;

  // get material sources and create shader program
  const vsSource = resources.shaders.testVS;
  const fsSource = resources.shaders.testFS;

  const shaderProgram = createShaderProgram(vsSource, fsSource);

  // bind shader program to materials
  guiSight.material.shaderProgram = shaderProgram;
  skybox.material.shaderProgram = shaderProgram;
  plane.material.shaderProgram = shaderProgram;

  // fill materials with data
  const ambientLight = resources.gameObjects.ambientLight;
  const directLight = resources.gameObjects.directLight;

  plane.material.uniforms.directLightDirection.value = directLight.direction.toArray();
  plane.material.uniforms.directLightColor.value = directLight.color.toArray();
  plane.material.uniforms.directLightValue.value = [directLight.value];
  plane.material.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  plane.material.uniforms.ambientLightValue.value = [ambientLight.value];
  plane.material.uniforms.useColor1.value = [1];
  plane.material.uniforms.useNormal0.value = [0];
  plane.material.textures.color0 = resources.textures.test_color;
  plane.material.textures.color1 = resources.textures.unity;
  plane.material.textures.normal0 = resources.textures.normalMap01;

  skybox.material.uniforms.useEmission.value = [1];
  skybox.material.textures.color0 = resources.textures.skybox_color_01;

  guiSight.material.uniforms.useEmission.value = [1];
  guiSight.material.textures.color0 = resources.textures.gui_sight;
};

exports.gameInit = gameInit;
