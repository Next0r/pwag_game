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
  aircraft.material.shaderProgram = shaderProgram;

  /**
   *@type {GameObject}
   */
  const concrete = resources.gameObjects.concrete;
  concrete.mesh = resources.meshes.concretePlane;
  concrete.material = resources.materials.concrete;
  concrete.material.shaderProgram = shaderProgram;

  // update materials settings and textures
  const ambientLight = resources.gameObjects.ambientLight;
  const directLight = resources.gameObjects.directLight;

  aircraft.material.uniforms.directLightDirection.value = directLight.direction.toArray();
  aircraft.material.uniforms.directLightColor.value = directLight.color.toArray();
  aircraft.material.uniforms.directLightValue.value = [directLight.value];
  aircraft.material.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  aircraft.material.uniforms.ambientLightValue.value = [ambientLight.value];
  aircraft.material.uniforms.useColor1.value = [1];
  aircraft.material.uniforms.useNormal0.value = [0];
  aircraft.material.textures.color0 = resources.textures.test_color;
  aircraft.material.textures.color1 = resources.textures.unity;

  concrete.material.uniforms.directLightDirection.value = directLight.direction.toArray();
  concrete.material.uniforms.directLightColor.value = directLight.color.toArray();
  concrete.material.uniforms.directLightValue.value = [directLight.value];
  concrete.material.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  concrete.material.uniforms.ambientLightValue.value = [ambientLight.value];
  concrete.material.textures.color0 = resources.textures.concrete01;

  /**
   * @type {Material}
   */
  const guiTextMaterial = resources.materials.guiText;
  guiTextMaterial.shaderProgram = shaderProgram;
  guiTextMaterial.uniforms.useEmission.value = [1];
  guiTextMaterial.textures.color0 = resources.textures.mono55;
};

exports.initStartMenu = initStartMenu;
