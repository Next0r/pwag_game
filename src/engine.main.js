const draw = require("./engine.draw");
const utilities = require("./engine.utilities");
const { createShaderProgram } = require("./engine.shader");
const utilitiesCollada = require("./engine.utilities.collada");
const { ProgramInfo } = require("./engine.shader.programInfo");
const { GLBuffer } = require("./engine.glBuffer");
const { Vector3 } = require("./engine.math.vector3");
const { GameObject } = require("./engine.gameObject");
const { Camera } = require("./engine.camera");
const { DirectLight } = require("./engine.light.direct");
const { AmbientLight } = require("./engine.light.ambient");
const { VertexInfo } = require("./engine.vertexInfo");
const { Matrix4 } = require("./engine.math.matrix4");
const gl = utilities.getGLContext();

const main = () => {
  if (!gl) {
    return;
  }

  const m = new Matrix4();
  m.fromArray([1, 3, 2, 3, 3, 1, 0, 0, 0, 2, 1, 0, 0, 0, 1, 1]);
  console.log(m.inverse());

  // read resources
  const vsSource = utilities.readTextFile("./shaders/testVS.txt");
  const fsSource = utilities.readTextFile("./shaders/testFS.txt");
  const box = utilitiesCollada.readColladaFile("./models/box.dae")[0];
  const sphere = utilitiesCollada.readColladaFile("./models/sphere.dae")[0];

  // console.log(sphere);

  const gameObject = new GameObject();
  gameObject.mesh = sphere;
  gameObject.transform.location = new Vector3(0, 0, -5);
  gameObject.transform.rotation = new Vector3(0, 0, 0);
  gameObject.transform.scale = new Vector3(1, 1, 1);
  gameObject.transform.rebuildMatrix();

  const camera = new Camera();
  camera.transform.rebuildMatrix();
  camera.projection.rebuildMatrix();

  const directLight = new DirectLight();
  directLight.direction = new Vector3(1, -1, -1).normalize();
  const ambientLight = new AmbientLight();
  ambientLight.value = 0.1;

  const projectionMatrix = camera.projection.matrix;
  const viewMatrix = camera.transform.matrix.clone().inverse();
  const modelViewMatrix = viewMatrix.multiply(gameObject.transform.matrix);
  const normalMatrix = modelViewMatrix.clone().inverse().transpose();

  const shaderProgram = createShaderProgram(vsSource, fsSource);
  const programInfo = new ProgramInfo(shaderProgram);
  const vertexInfo = new VertexInfo(gameObject.mesh, programInfo);

  // create and bind used vao at the beginning
  gameObject.programInfo = programInfo;
  gameObject.vertexInfo = vertexInfo;
  gameObject.vertexInfo.bind();

  //draw

  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniforms.modelViewMatrix.location,
    false,
    modelViewMatrix.toArray()
  );

  gl.uniformMatrix4fv(
    programInfo.uniforms.projectionMatrix.location,
    false,
    projectionMatrix.toArray()
  );
  gl.uniformMatrix4fv(
    programInfo.uniforms.normalMatrix.location,
    false,
    normalMatrix.toArray()
  );

  gl.uniform3fv(
    programInfo.uniforms.directLightDirection.location,
    directLight.direction.toArray()
  );
  gl.uniform3fv(
    programInfo.uniforms.directLightColor.location,
    directLight.color.toArray()
  );
  gl.uniform1f(
    programInfo.uniforms.directLightValue.location,
    directLight.value
  );
  gl.uniform3fv(
    programInfo.uniforms.ambientLightColor.location,
    ambientLight.color.toArray()
  );
  gl.uniform1f(
    programInfo.uniforms.ambientLightValue.location,
    ambientLight.value
  );

  gl.drawArrays(gl.TRIANGLES, 0, gameObject.mesh.vertices.length);
};

window.onload = main;
