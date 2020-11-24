/**
 * Describes position of character on text texture
 */
class CharacterDescriptor{
  /**
   * Creates new character descriptor
   * @param {number} posX x position on texture as integer
   * @param {number} posY y position on texture as integer
   * @param {number} space character offset (this property is not used)
   */
  constructor(posX, posY, space){
    /**
     * x position on texture as integer
     * @type {number}
     */
    this.posX = posX;
    /**
     * y position on texture as integer
     * @type {number}
     */
    this.posY = posY;
    /**
     * character offset (this property is not used)
     * @type {number}
     */
    this.space = space;
  }
}

/**
 * Table of character descriptors, allows to acquire x and y position of character on 
 * text texture. Characters are ordered in classic ASCII fashion e.g charTable[65] describes "A" 
 */
const charTable = [
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),

  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),

  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(9, 2),
  new CharacterDescriptor(10, 2),
  new CharacterDescriptor(11, 2),

  new CharacterDescriptor(0, 3),
  new CharacterDescriptor(1, 3),
  new CharacterDescriptor(2, 3),
  new CharacterDescriptor(3, 3),
  new CharacterDescriptor(4, 3),
  new CharacterDescriptor(5, 3),
  new CharacterDescriptor(6, 3),
  new CharacterDescriptor(7, 3),
  new CharacterDescriptor(8, 3),
  new CharacterDescriptor(9, 3),
  new CharacterDescriptor(10, 3),
  new CharacterDescriptor(11, 3),

  new CharacterDescriptor(0, 4),
  new CharacterDescriptor(1, 4),
  new CharacterDescriptor(2, 4),
  new CharacterDescriptor(3, 4),
  new CharacterDescriptor(4, 4),
  new CharacterDescriptor(5, 4),
  new CharacterDescriptor(6, 4),
  new CharacterDescriptor(7, 4),
  new CharacterDescriptor(8, 4),
  new CharacterDescriptor(9, 4),
  new CharacterDescriptor(10, 4),
  new CharacterDescriptor(11, 4),

  new CharacterDescriptor(0, 5),
  new CharacterDescriptor(1, 5),
  new CharacterDescriptor(2, 5),
  new CharacterDescriptor(3, 5),
  new CharacterDescriptor(4, 5),
  new CharacterDescriptor(5, 5),
  new CharacterDescriptor(6, 5),
  new CharacterDescriptor(7, 5),
  new CharacterDescriptor(8, 5),
  new CharacterDescriptor(9, 5),
  new CharacterDescriptor(10, 5),
  new CharacterDescriptor(11, 5),

  new CharacterDescriptor(0, 6),
  new CharacterDescriptor(1, 6),
  new CharacterDescriptor(2, 6),
  new CharacterDescriptor(3, 6),
  new CharacterDescriptor(4, 6),
  new CharacterDescriptor(5, 6),
  new CharacterDescriptor(6, 6),
  new CharacterDescriptor(7, 6),
  new CharacterDescriptor(8, 6),
  new CharacterDescriptor(9, 6),
  new CharacterDescriptor(10, 6),
  new CharacterDescriptor(11, 6),

  new CharacterDescriptor(0, 7),
  new CharacterDescriptor(1, 7),
  new CharacterDescriptor(2, 7),
  new CharacterDescriptor(3, 7),
  new CharacterDescriptor(4, 7),
  new CharacterDescriptor(5, 7),
  new CharacterDescriptor(6, 7),
  new CharacterDescriptor(7, 7),
  new CharacterDescriptor(8, 7),
  new CharacterDescriptor(9, 7),
  new CharacterDescriptor(10, 7),
  new CharacterDescriptor(11, 7),

  new CharacterDescriptor(0, 8),
  new CharacterDescriptor(1, 8),
  new CharacterDescriptor(2, 8),
  new CharacterDescriptor(3, 8),
  new CharacterDescriptor(4, 8),
  new CharacterDescriptor(5, 8),
  new CharacterDescriptor(6, 8),
  new CharacterDescriptor(7, 8),
  new CharacterDescriptor(8, 8),
  new CharacterDescriptor(9, 8),
  new CharacterDescriptor(10, 8),
  new CharacterDescriptor(11, 8),

  new CharacterDescriptor(0, 9),
  new CharacterDescriptor(1, 9),
  new CharacterDescriptor(2, 9),
  new CharacterDescriptor(3, 9),
  new CharacterDescriptor(4, 9),
  new CharacterDescriptor(5, 9),
  new CharacterDescriptor(6, 9),
  new CharacterDescriptor(7, 9),
  new CharacterDescriptor(8, 9),
  new CharacterDescriptor(9, 9),
  new CharacterDescriptor(10, 9),
  new CharacterDescriptor(11, 9),

  new CharacterDescriptor(0, 10),
  new CharacterDescriptor(1, 10),
  new CharacterDescriptor(2, 10),
  new CharacterDescriptor(3, 10),
  new CharacterDescriptor(4, 10),
  new CharacterDescriptor(5, 10),
  new CharacterDescriptor(6, 10),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),

  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
  new CharacterDescriptor(),
];

exports.charTable = charTable;
