import Canvas from "./modules/canvas.js";

const worker = new Worker(new URL('./workers/worker.js', import.meta.url), { type: 'module' });
const canvasData = await new Canvas({ canvasId: "onScreenCanvas", parentID: "svgParticles" }).load();

worker.postMessage({ type: "initialize", canvasData: canvasData }, [canvasData.offScreenCanvas]);
