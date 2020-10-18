const { EngineInfo } = require("./engine.info");
const { AmbientLight } = require("./engine.light.ambient");
const { DirectLight } = require("./engine.light.direct");
const { Material } = require("./engine.material");

const initializeMaterials = () => {
  const engineInfo = new EngineInfo();
  const materialResources = engineInfo.get("materialResources");
  const textureResources = engineInfo.get("textureResources");
  const scene = engineInfo.get("scene");

  /**
   * @type {Material}
   */
  const boxMaterial = materialResources.get("box");
  /**
   * @type {Material}
   */
  const skyboxMaterial = materialResources.get("skybox");
  /**
   * @type {Material}
   */
  const guiSightMaterial = materialResources.get("guiSight");

  /**
   * @type {AmbientLight}
   */
  const ambientLight = scene.get("ambientLight");
  /**
   * @type {DirectLight}
   */
  const directLight = scene.get("directLight");

  boxMaterial.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  boxMaterial.uniforms.ambientLightValue.value = [ambientLight.value];
  boxMaterial.uniforms.directLightDirection.value = directLight.direction.toArray();
  boxMaterial.uniforms.directLightColor.value = directLight.color.toArray();
  boxMaterial.uniforms.directLightValue.value = [directLight.value];
  boxMaterial.uniforms.color0Sampler.value = [0];
  boxMaterial.uniforms.useVertexColor.value = [0];
  boxMaterial.uniforms.useEmission.value = [0];
  boxMaterial.textures.color0 = textureResources.get("testColor");

  skyboxMaterial.uniforms.color0Sampler.value = [0];
  skyboxMaterial.uniforms.useVertexColor.value = [0];
  skyboxMaterial.uniforms.useEmission.value = [1];
  skyboxMaterial.textures.color0 = textureResources.get("skyboxColor");

  guiSightMaterial.uniforms.color0Sampler.value = [0];
  guiSightMaterial.uniforms.useVertexColor.value = [0];
  guiSightMaterial.uniforms.useEmission.value = [1];
  guiSightMaterial.textures.color0 = textureResources.get("guiSight");
};

exports.initializeMaterials = initializeMaterials;
