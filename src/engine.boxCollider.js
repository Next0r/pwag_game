const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { Mesh } = require("./engine.utilities.mesh");
const { Vector4 } = require("./engine.math.vector4");

/**
 * Allows to create mesh based colliders. Takes part in OBB collision detection.
 */
class BoxCollider {
  /**
   * Creates new box collider with specified identifier
   * @param {String} colliderID unique string that represents box collider instance
   */
  constructor(colliderID) {
    this.id = colliderID;
    this.size = new Vector3();
    this.center = new Vector3();
    this.radius = 0;
    this.transformationMatrix = new Matrix4();
    this.onCollision = () => {};
  }

  /**
   * Changes box collider size, center and radius to match given mesh
   * @param {Mesh} mesh instance of mesh that represents base for box collider size calculation
   * @returns {BoxCollider} reference to self for easier method chaining
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
  }

  /**
   * Allows to acquire vertices of box collider boundary
   * @returns {Vector4[]} array of box collider vertices modified with transformation matrix
   */
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
  }

  /**
   * Allows to acquire box collider "normals" that represent forward, right and up vectors of oriented box
   * @returns {Vector4[]} array of forward, right and up vectors of oriented box
   */
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
  }

  /**
   * Performs separate axis test (and simple sphere collision test for efficiency)
   * @param {BoxCollide} boxCollider other box collider that might collide with this one
   * @returns {undefined|String} id of colliding box if collision occurred or undefined if not
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
      const myMinMax = this._getMinMax(myVertices, normal);
      const minMax = this._getMinMax(vertices, normal);
      if (myMinMax.posMax < minMax.posMin || minMax.posMax < myMinMax.posMin) {
        return undefined;
      }
    }

    for (let normal of normals) {
      const myMinMax = this._getMinMax(myVertices, normal);
      const minMax = this._getMinMax(vertices, normal);
      if (myMinMax.posMax < minMax.posMin || minMax.posMax < myMinMax.posMin) {
        return undefined;
      }
    }

    return boxCollider.id;
  }

  /**
   * @typedef {Object} MinMax
   * @property {number} min value of minimum
   * @property {number} max value of maximum
   */

  /**
   * This method is used to perform separate axis test, usage is not recommended
   * @param {Vector4[]} vertices vertices of collider bounding box
   * @param {Vector4[]} normal forward, right and up vectors of bounding box
   * @returns {MinMax} compartment with minimum and maximum value
   */
  _getMinMax(vertices, normal) {
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
  }
}

module.exports.BoxCollider = BoxCollider;
