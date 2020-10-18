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
  const planeMaterial = materialResources.get("plane");
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

  planeMaterial.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  planeMaterial.uniforms.ambientLightValue.value = [ambientLight.value];
  planeMaterial.uniforms.directLightDirection.value = directLight.direction.toArray();
  planeMaterial.uniforms.directLightColor.value = directLight.color.toArray();
  planeMaterial.uniforms.directLightValue.value = [directLight.value];
  planeMaterial.uniforms.color0Sampler.value = [0];
  planeMaterial.uniforms.color1Sampler.value = [1];
  planeMaterial.uniforms.useColor0.value = [1];
  planeMaterial.uniforms.useColor1.value = [1];
  planeMaterial.uniforms.useVertexColor.value = [0];
  planeMaterial.uniforms.useEmission.value = [0];
  planeMaterial.textures.color0 = textureResources.get("testColor");
  planeMaterial.textures.color1 = textureResources.get("unity");

  skyboxMaterial.uniforms.color0Sampler.value = [0];
  skyboxMaterial.uniforms.useColor0.value = [1];
  skyboxMaterial.uniforms.useColor1.value = [0];
  skyboxMaterial.uniforms.useVertexColor.value = [0];
  skyboxMaterial.uniforms.useEmission.value = [1];
  skyboxMaterial.textures.color0 = textureResources.get("skyboxColor");

  guiSightMaterial.uniforms.color0Sampler.value = [0];
  guiSightMaterial.uniforms.useColor0.value = [1];
  guiSightMaterial.uniforms.useColor1.value = [0];
  guiSightMaterial.uniforms.useVertexColor.value = [0];
  guiSightMaterial.uniforms.useEmission.value = [1];
  guiSightMaterial.textures.color0 = textureResources.get("guiSight");
};

exports.initializeMaterials = initializeMaterials;
