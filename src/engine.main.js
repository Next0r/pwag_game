const draw = require("./engine.draw");
const utilities = require("./engine.utils");
const { createShaderProgram } = require("./engine.shader");
const utilitiesCollada = require("./engine.utilities.collada");
const { Vector3 } = require("./engine.math.vector3");
const { GameObject } = require("./engine.gameObject");
const { Camera } = require("./engine.camera");
const { DirectLight } = require("./engine.light.direct");
const { AmbientLight } = require("./engine.light.ambient");
const { Matrix4 } = require("./engine.math.matrix4");
const { Material } = require("./engine.material");
const { Game } = require("./engine.game");
const { Time } = require("./engine.time");
const { readFile } = require("fs");
const { TextureResources } = require("./engine.textureResources");
const { Texture } = require("./engine.material.textures");
const { removeDoubles, toArrayWithUniqueValues, createRepetitionArray } = require("./engine.utilities.mesh");
const { EngineToolbox } = require("./engine.toolbox");

const main = () => {
  // create game info
  EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    return;
  }

  // read resources
  const vsSource = EngineToolbox.readTextFile("./shaders/testVS.txt");
  const fsSource = EngineToolbox.readTextFile("./shaders/testFS.txt");
  const box = utilitiesCollada.readColladaFile("./models/box2.dae")[0];
  box.createElementArray();
  const sphere = utilitiesCollada.readColladaFile("./models/sphere.dae")[0];
  sphere.createElementArray();
  const plane = utilitiesCollada.readColladaFile("./models/plane.dae")[0];
  plane.createElementArray();
  const plane2 = utilitiesCollada.readColladaFile("./models/plane2.dae")[0]; // with vertex colors
  plane2.createElementArray();

  // read and store textures
  const textureResources = new TextureResources();
  const testTextureImage = EngineToolbox.readImage("./textures/test_color.png");
  const testTexture = new Texture();
  testTexture.fromPNGImage(testTextureImage);
  textureResources.add("testTexture", testTexture);

  // create scene objects
  const gameObject = new GameObject();
  gameObject.mesh = box;
  gameObject.transform.location = new Vector3(0, 0, -5);
  gameObject.transform.rotation = new Vector3(0, 0, 0);
  gameObject.transform.scale = new Vector3(1, 1, 1);
  gameObject.transform.rebuildMatrix();

  const camera = new Camera();
  camera.transform.rebuildMatrix();
  camera.projection.rebuildMatrix();

  const directLight = new DirectLight();
  const ambientLight = new AmbientLight();

  // setup material parameters
  const projectionMatrix = camera.projection.matrix;
  const viewMatrix = camera.transform.matrix.clone().inverse();
  const modelViewMatrix = viewMatrix.multiply(gameObject.transform.matrix);
  const normalMatrix = modelViewMatrix.clone().inverse().transpose();

  const shaderProgram = createShaderProgram(vsSource, fsSource);

  const material = new Material(shaderProgram, gameObject.mesh);
  material.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
  material.uniforms.projectionMatrix.value = projectionMatrix.toArray();
  material.uniforms.normalMatrix.value = normalMatrix.toArray();
  material.uniforms.directLightDirection.value = directLight.direction.toArray();
  material.uniforms.directLightColor.value = directLight.color.toArray();
  material.uniforms.directLightValue.value = [directLight.value];
  material.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  material.uniforms.ambientLightValue.value = [ambientLight.value];
  material.uniforms.color0Sampler.value = [0];
  material.uniforms.useVertexColor.value = [0];

  material.textures.color0 = textureResources.get("testTexture");

  // pass uniforms and attributes values to gpu memory
  material.createVertexArray();
  material.uploadUniforms();

  // enable texture units and bind textures
  material.uploadTextures();

  // has to be called if uploadUniforms() is not used before.
  material.useProgram();
  // use vertex array object (mesh data linked to material)
  material.bindVertexArray();

  gameObject.material = material;

  // draw
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // const elementArrayBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArrayBuffer);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(gameObject.mesh.elementArray), gl.STATIC_DRAW);
  gl.drawElements(gl.TRIANGLES, gameObject.mesh.elementArray.length, gl.UNSIGNED_INT, 0);

  // gl.drawArrays(gl.TRIANGLES, 0, gameObject.mesh.vertices.length);

  Game.mainFunction = () => {
    gameObject.transform.rotation.y += Time.delta * 60;
    gameObject.transform.rotation.z += Time.delta * 60;
    gameObject.transform.location = new Vector3(Math.sin(Time.now), Math.cos(Time.now), -5);
    gameObject.transform.rebuildMatrix();
    const mvMatrix = camera.transform.matrix.clone().inverse().multiply(gameObject.transform.matrix);
    material.uniforms.modelViewMatrix.value = mvMatrix.toArray();
    material.uniforms.normalMatrix.value = mvMatrix.clone().inverse().transpose().toArray();
    gameObject.material.uploadUniforms();
    gameObject.material.useProgram();
    gameObject.material.bindVertexArray();

    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, gameObject.mesh.elementArray.length, gl.UNSIGNED_INT, 0);
    // gl.drawArrays(gl.TRIANGLES, 0, gameObject.mesh.vertices.length);
  };

  Game.startLoop();
};

window.onload = main;
