export class NPC {
  constructor(x, y, path, scale = 1, flipped = false, name = '', atlasPath = '') {
    this.x = x;
    this.y = y;
    this.path = path;
    this.scale = scale;
    this.flipped = flipped;
    this.dialogue = null;
    this.dialogueFilename = null;
    this.name = name;
    this.atlasPath = atlasPath;
  }
}
