const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { Mesh } = require("./engine.utilities.mesh");
const { Vector4 } = require("./engine.math.vector4");

/**
 *
 * @param {*} colliderID
 */
const CreateBoxCollider = (colliderID) => ({
  id: colliderID,
  size: new Vector3(),
  center: new Vector3(),
  transformationMatrix: new Matrix4(),

  /**
   *
   * @param {Mesh} mesh
   */
  recalculate(mesh) {
    let posMin = [...mesh.positions[0]];
    let posMax = [...mesh.positions[0]];

    for (let position of mesh.positions) {
      if (position[0] < posMin[0] && position[1] < posMin[1] && position[2] < posMin[2]) {
        posMin = [...position];
      }
      if (position[0] > posMax[0] && position[1] > posMax[1] && position[2] > posMax[2]) {
        posMax = [...position];
      }
    }

    this.center.x = (posMin[0] + posMax[0]) * 0.5;
    this.center.y = (posMin[1] + posMax[1]) * 0.5;
    this.center.z = (posMin[2] + posMax[2]) * 0.5;

    this.size.x = posMax[0] - posMin[0];
    this.size.y = posMax[1] - posMin[1];
    this.size.z = posMax[2] - posMin[2];
  },

  getVertices() {
    const xs = this.size.x * 0.5;
    const ys = this.size.y * 0.5;
    const zs = this.size.z * 0.5;
    const vertices = [
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x - xs, this.center.y - ys, this.center.z - zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x - xs, this.center.y - ys, this.center.z + zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x - xs, this.center.y + ys, this.center.z - zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x - xs, this.center.y + ys, this.center.z + zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x + xs, this.center.y - ys, this.center.z - zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x + xs, this.center.y - ys, this.center.z + zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x + xs, this.center.y + ys, this.center.z - zs, 1)
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(this.center.x + xs, this.center.y + ys, this.center.z + zs, 1)
      ),
    ];
    return vertices;
  },

  getNormals() {
    const xs = this.size.x * 0.5;
    const ys = this.size.y * 0.5;
    const zs = this.size.z * 0.5;
    const normals = [];

    let v0 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x + xs, this.center.y - ys, this.center.z + zs, 1)
    );
    let v1 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x + xs, this.center.y - ys, this.center.z - zs, 1)
    );
    let v2 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x + xs, this.center.y + ys, this.center.z + zs, 1)
    );

    let e0 = v1.subtract(v0);
    let e1 = v2.subtract(v0);

    normals.push(e0.cross(e1));

    v0 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x - xs, this.center.y + ys, this.center.z + zs, 1)
    );
    v1 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x + xs, this.center.y + ys, this.center.z + zs, 1)
    );
    v2 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x - xs, this.center.y + ys, this.center.z - zs, 1)
    );

    e0 = v1.subtract(v0);
    e1 = v2.subtract(v0);

    normals.push(e0.cross(e1));

    v0 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x - xs, this.center.y - ys, this.center.z + zs, 1)
    );
    v1 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x + xs, this.center.y - ys, this.center.z + zs, 1)
    );
    v2 = this.transformationMatrix.vectorMultiply(
      new Vector4(this.center.x - xs, this.center.y + ys, this.center.z + zs, 1)
    );

    e0 = v1.subtract(v0);
    e1 = v2.subtract(v0);

    normals.push(e0.cross(e1));
    return normals;
  },

  doesCollide(boxCollider) {
    const myVertices = this.getVertices();
    const myNormals = this.getNormals();

    const vertices = boxCollider.getVertices();
    const normals = boxCollider.getNormals();

    for (let normal of myNormals) {
      const myMinMax = getMinMax(myVertices, normal);
      const minMax = getMinMax(vertices, normal);
      if (boundariesSeparate(myMinMax.posMin, myMinMax.posMax, minMax.posMin, minMax.posMax)) {
        return undefined;
      }
    }

    for (let normal of normals) {
      const myMinMax = getMinMax(myVertices, normal);
      const minMax = getMinMax(vertices, normal);
      if (boundariesSeparate(myMinMax.posMin, myMinMax.posMax, minMax.posMin, minMax.posMax)) {
        return undefined;
      }
    }

    return boxCollider.id;
  },
});

const boundariesSeparate = (min0, max0, min1, max1) => {
  return max0 < min1 || max1 < min0;
};

const getMinMax = (vertices, normal) => {
  const positions = [];

  for (let vertex of vertices) {
    positions.push(vertex.dot(normal));
  }

  let posMin = positions[0];
  let posMax = positions[0];

  for (let position of positions) {
    if (position < posMin) {
      posMin = position;
    }
    if (position > posMax) {
      posMax = position;
    }
  }

  return { posMin, posMax };
};

exports.CreateBoxCollider = CreateBoxCollider;
