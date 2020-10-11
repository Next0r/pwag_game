const draw = require("./engine.draw");
const utilities = require("./engine.utilities");
const shader = require("./engine.shader");
const utilitiesCollada = require("./engine.utilities.collada");
const { ProgramInfo } = require("./engine.shader.programInfo");
const { Buffer } = require("./engine.buffer");
const { Matrix4 } = require("./engine.math.matrix4");
const { Vector4 } = require("./engine.math.vector4");
const { Vector3 } = require("./engine.math.vector3");
const { GameObject } = require("./engine.gameObject");
const { Camera } = require("./engine.camera");
const gl = utilities.getGLContext();

const main = () => {
  if (!gl) {
    return;
  }

  const vsSource = utilities.readTextFile("./shaders/testVS.txt");
  const fsSource = utilities.readTextFile("./shaders/testFS.txt");
  const box = utilitiesCollada.readColladaFile("./models/box.dae")[0];

  const gameObject = new GameObject();
  gameObject.mesh = box;
  gameObject.transform.location = new Vector3(0, 0, -5);
  gameObject.transform.rotation = new Vector3(0, 45, 45);
  gameObject.transform.scale = new Vector3(1, 1, 1);
  gameObject.transform.rebuildMatrix();

  const camera = new Camera();
  camera.transform.rebuildMatrix();
  camera.projection.rebuildMatrix();

  const projectionMatrix = camera.projection.matrix;
  const viewMatrix = camera.transform.matrix;
  const modelViewMatrix = gameObject.transform.matrix
    .clone()
    .multiply(viewMatrix);

  const shaderProgram = shader.createShaderProgram(vsSource, fsSource);
  const programInfo = new ProgramInfo(shaderProgram);
  programInfo.attributes.position.setLocation("a_position");
  programInfo.attributes.color.setLocation("a_color");
  programInfo.uniforms.modelViewMatrix.setLocation("u_model_view_matrix");
  programInfo.uniforms.projectionMatrix.setLocation("u_projection_matrix");

  // create and bind used vao at the beginning
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = new Buffer();
  const colorBuffer = new Buffer();

  positionBuffer.setArray(
    new Float32Array(gameObject.mesh.getPositionsArray())
  );
  positionBuffer.setArrayInfo({
    attributeLocation: programInfo.attributes.position.location,
    size: 3,
  });
  positionBuffer.enable();

  colorBuffer.setArray(new Float32Array(gameObject.mesh.getColorsArray()));
  colorBuffer.setArrayInfo({
    attributeLocation: programInfo.attributes.color.location,
    size: 4,
  });
  colorBuffer.enable();

  //draw

  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  gl.bindVertexArray(vao);

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

  gl.drawArrays(gl.TRIANGLES, 0, box.vertices.length);
};

window.onload = main;
