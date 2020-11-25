const engineResources = require("./engine.resources").Resources();
const { createShaderProgram } = require("./engine.shader");
const { GameObject } = require("./engine.gameObject");
const { Material } = require("./engine.material");

const initLevel = () => {
  const vsSource = engineResources.getShader("testVS");
  const fsSource = engineResources.getShader("testFS");

  const shaderProgram = createShaderProgram(vsSource, fsSource);

  const camera = engineResources.getCamera();
  camera.projection.far = 1000;

  /**
   * @type {GameObject}
   */
  const skybox = engineResources.getGameObject("skybox");
  skybox.mesh = engineResources.getMesh("skybox");
  skybox.material = engineResources.getMaterial("skybox");

  const directLight = engineResources.getDirectLight();
  const ambientLight = engineResources.getAmbientLight();

  // skybox material
  let mat = skybox.material;
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = engineResources.getTexture("skybox_color_01");

  // gui elements material
  mat = engineResources.getMaterial("guiElement");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];

  // aircraft material
  mat = engineResources.getMaterial("aircraft");
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

  // gate material
  mat = engineResources.getMaterial("gate");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.textures.color0 = engineResources.getTexture("gate_color");

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("gate_lamps_off");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.directLightDirection.value = directLight.direction.toArray();
  mat.uniforms.directLightColor.value = directLight.color.toArray();
  mat.uniforms.directLightValue.value = [directLight.value];
  mat.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  mat.uniforms.ambientLightValue.value = [ambientLight.value];
  mat.uniforms.mapOffsetY.value = [-0.5];
  mat.textures.color0 = engineResources.getTexture("lamp_sign_color");

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("gate_lamps_on");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = engineResources.getTexture("lamp_sign_color");

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("water");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = engineResources.getTexture("water_color");

  /**
   * @type {Material}
   */
  mat = engineResources.getMaterial("propeller");
  mat.shaderProgram = shaderProgram;
  mat.uniforms.setLocations(shaderProgram);
  mat.uniforms.useEmission.value = [1];
  mat.textures.color0 = engineResources.getTexture("propeller");
};

exports.initLevel = initLevel;
