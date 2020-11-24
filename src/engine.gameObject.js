const { Transform } = require("./engine.gameObject.transform");
const { Material } = require("./engine.material");
const { Mesh } = require("./engine.utilities.mesh");
const { BoxCollider } = require("./engine.boxCollider");

/**
 * Represents most of elements present on scene, game objects
 * are your virtual planes, tanks etc. Use engine json file to
 * create new game objects.
 */
class GameObject {
  /**
   * Creates new game object
   */
  constructor() {
    /**
     * Game object transform module, allows to change it's position, rotation and scale
     * @type {Transform}
     */
    this.transform = new Transform();
    /**
     * Mesh module of game object, contains vertices, vertex colors, normal vectors etc.
     * @type {Mesh}
     */
    this.mesh = new Mesh();
    /**
     * Material module describes how object does look on scene, here you can make it
     * shadeless for example
     * @type {Material}
     */
    this.material = new Material();
    /**
     * Array of box colliders that are part of this game object, putting collider in here
     * does NOT make it follow, to achieve that you need to change collider 
     * transformation matrix reference
     * @type {BoxCollider[]}
     */
    this.colliders = [];
  }
}

exports.GameObject = GameObject;
