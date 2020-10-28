const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { Mesh } = require("./engine.utilities.mesh");
const { Vector4 } = require("./engine.math.vector4");

/**
 * @typedef {Object} BoxCollider
 * @property {String} id
 * @property {Vector3} size
 * @property {Vector3} center
 * @property {Matrix4} transformationMatrix
 * @property {function} onCollide
 * @property {function} recalculate
 * @property {function} getVertices
 * @property {function} getNormals
 * @property {function} doesCollide
 */

/**
 *
 * @param {*} colliderID
 */
const CreateBoxCollider = (colliderID) => ({
  id: colliderID,
  size: new Vector3(),
  center: new Vector3(),
  radius: 0,
  transformationMatrix: new Matrix4(),
  onCollision: () => {},

  /**
   *
   * @param {Mesh} mesh
   */
  recalculate(mesh) {
    let posMin = new Vector3();
    let posMax = new Vector3();
    posMax.x = posMin.x = mesh.positions[0].x;
    posMax.y = posMin.y = mesh.positions[0].y;
    posMax.z = posMin.z = mesh.positions[0].z;

    for (let position of mesh.positions) {
      if (position.x > posMax.x) {
        posMax.x = position.x;
      } else if (position.x < posMin.x) {
        posMin.x = position.x;
      }

      if (position.y > posMax.y) {
        posMax.y = position.y;
      } else if (position.y < posMin.y) {
        posMin.y = position.y;
      }

      if (position.z > posMax.z) {
        posMax.z = position.z;
      } else if (position.z < posMin.z) {
        posMin.z = position.z;
      }
    }

    this.center.x = (posMin.x + posMax.x) * 0.5;
    this.center.y = (posMin.y + posMax.y) * 0.5;
    this.center.z = (posMin.z + posMax.z) * 0.5;

    this.size.x = posMax.x - posMin.x;
    this.size.y = posMax.y - posMin.y;
    this.size.z = posMax.z - posMin.z;

    this.radius = posMax.subtract(this.center).length();
    return this;
  },

  getVertices() {
    const xs = this.size.x * 0.5;
    const ys = this.size.y * 0.5;
    const zs = this.size.z * 0.5;
    const vertices = [
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x - xs,
          this.center.y - ys,
          this.center.z - zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x - xs,
          this.center.y - ys,
          this.center.z + zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x - xs,
          this.center.y + ys,
          this.center.z - zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x - xs,
          this.center.y + ys,
          this.center.z + zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x + xs,
          this.center.y - ys,
          this.center.z - zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x + xs,
          this.center.y - ys,
          this.center.z + zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x + xs,
          this.center.y + ys,
          this.center.z - zs,
          1
        )
      ),
      this.transformationMatrix.vectorMultiply(
        new Vector4(
          this.center.x + xs,
          this.center.y + ys,
          this.center.z + zs,
          1
        )
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

    normals.push(e0.cross(e1).normalize());

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

    normals.push(e0.cross(e1).normalize());

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

    normals.push(e0.cross(e1).normalize());
    return normals;
  },

  /**
   *
   * @param {BoxCollider} boxCollider
   */
  doesCollide(boxCollider) {
    const myGlobalPos = this.transformationMatrix
      .getPosition()
      .add(this.center);
    const globalPos = boxCollider.transformationMatrix
      .getPosition()
      .add(boxCollider.center);

    if (
      globalPos.subtract(myGlobalPos).length() >
      this.radius + boxCollider.radius
    ) {
      return;
    }

    const myVertices = this.getVertices();
    const myNormals = this.getNormals();

    const vertices = boxCollider.getVertices();
    const normals = boxCollider.getNormals();

    for (let normal of myNormals) {
      const myMinMax = getMinMax(myVertices, normal);
      const minMax = getMinMax(vertices, normal);
      if (
        boundariesSeparate(
          myMinMax.posMin,
          myMinMax.posMax,
          minMax.posMin,
          minMax.posMax
        )
      ) {
        return undefined;
      }
    }

    for (let normal of normals) {
      const myMinMax = getMinMax(myVertices, normal);
      const minMax = getMinMax(vertices, normal);
      if (
        boundariesSeparate(
          myMinMax.posMin,
          myMinMax.posMax,
          minMax.posMin,
          minMax.posMax
        )
      ) {
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
