import svgShapes from "./svgShapes.js";

export default class Canvas {
  constructor({ canvasId, parentID }) {
    this.canvasId = canvasId;
    this.parentID = parentID;
  }

  async load() {

    const svgObjects = await new svgShapes().load();

    let canvasObj = document.createElement("canvas");

    canvasObj.style.display = "block";
    canvasObj.id = this.canvasId;
    document.getElementById(this.parentID).append(canvasObj);

    const onScreenCanvas = document.getElementById(this.canvasId);
    onScreenCanvas.width = svgObjects.viewBox.w; // ensure canvas width matches SVG viewBox width for proper scaling
    onScreenCanvas.height = svgObjects.viewBox.h; // ensure canvas height matches SVG viewBox height for proper scaling

    const offScreenCanvas = onScreenCanvas.transferControlToOffscreen();

    return {
      svgObjects,
      offScreenCanvas,
    };
  }
}
