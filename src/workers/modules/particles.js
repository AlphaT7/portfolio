import Particle from "./particle.js";

export default class Particles {
  constructor({ canvasData }) {
    this.canvas = canvasData.offScreenCanvas;
    this.ctx = canvasData.offScreenCanvas.getContext("2d");
    this.svgObjects = canvasData.svgObjects;
    this.pointer = {
      x: 0,
      y: 0,
    };
    this.center = canvasData.center;
    this.velocity = { x: 0, y: 0 };
    this.particleCountPerPath = [70, 170]; // Number of particles per SVG path
    this.svgPaths = []; // Array of SVG paths
    this.possibleParticles = []; // Array of possible particle positions
    this.particleArrays = []; // Array(s) of particle instances ready for rendering
    this.particleLines = []; // Array of particle lines for connecting particles
    this.particleColors = ["#a9e2ff", "#36b7ff", "#97d9ff", "#a9e2ff", "#0d86c5", "#a9e2ff", "#0d86c5", "#0d86c5"];
    this.persistentConnections = new Map(); // Map to store persistent connections between particles
  }

  getRandomNumberRange(max, min) {
    return Math.random() * (max - min) + min;
  }

  convertSVGpathToCTX() {
    this.svgObjects.paths.forEach((path) => {
      this.svgPaths.push(new Path2D(path));
    });
  }

  getPixelsInPath(shapePath) {

    let canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
    let ctx = canvas.getContext("2d");

    // Draw the scaled and translated SVG path filled on the offscreen canvas
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fill(shapePath);
    ctx.restore();

    // Get image data (mask)
    let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let data = imgData.data;
    const insidePixels = [];
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        // If alpha > 0, pixel is inside the shape
        if (data[index + 3] > 0) {
          insidePixels.push({ x, y });
        }
      }
    }

    return insidePixels;
  }

  async load() {

    this.convertSVGpathToCTX();
    this.svgPaths.forEach((path) => {
      this.possibleParticles.push(this.getPixelsInPath(path));
    });

    // Randomly select dotCount pixels from insidePixels
    this.possibleParticles.forEach((coordinateArray, pathIndex) => {
      let particleArray = [];
      for (let i = 0; i < this.particleCountPerPath[pathIndex]; i++) {
        const randomIndex = Math.floor(Math.random() * coordinateArray.length);
        const randomColor = this.randomColor(); // Random particle color
        const randomRadius = this.getRandomNumberRange(0, 0.1); // Random radius between 0 and 0.1
        particleArray.push(new Particle(coordinateArray[randomIndex].x, coordinateArray[randomIndex].y, randomRadius, randomColor));
        coordinateArray.splice(randomIndex, 1)[0];
      }
      this.particleArrays.push(particleArray);
    });
  }

  randomColor() {
    return this.particleColors[Math.floor(this.getRandomNumberRange(0, this.particleColors.length))];
  }


  createLines() {
    this.particleLines = [];
    const radius = 10;
    const lineWidth = 0.40;
    const gridSize = radius;
    const maxConnections = 25;

    this.particleArrays.forEach((particleArray, arrayIdx) => {
      const connectionCounts = new Array(particleArray.length).fill(0);

      // Build grid for spatial partitioning
      const grid = new Map();
      particleArray.forEach((particle, i) => {
        const x = Math.floor(particle.x / gridSize);
        const y = Math.floor(particle.y / gridSize);
        const key = `${ x },${ y }`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push({ p: particle, index: i });
      });

      const connKey = `array${ arrayIdx }`;
      if (!this.persistentConnections.has(connKey)) this.persistentConnections.set(connKey, new Map());
      const connMap = this.persistentConnections.get(connKey);

      // 1. Prune connections that exceed radius
      for (const [pair, meta] of connMap.entries()) {
        const [i, j] = pair.split('-').map(Number);
        const p1 = particleArray[i];
        const p2 = particleArray[j];
        if (!p1 || !p2) {
          connMap.delete(pair);
          continue;
        }
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) {
          connMap.delete(pair);
        } else {
          connectionCounts[i]++;
          connectionCounts[j]++;
        }
      }

      // 2. Add new connections if within radius and not already connected
      particleArray.forEach((p1, i) => {
        if (connectionCounts[i] >= maxConnections) return;
        const gx = Math.floor(p1.x / gridSize);
        const gy = Math.floor(p1.y / gridSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${ gx + dx },${ gy + dy }`;
            const cell = grid.get(key);
            if (!cell) continue;
            cell.forEach(({ p: p2, index: j }) => {
              if (i >= j) return;
              if (connectionCounts[j] >= maxConnections) return;
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const pairKey = `${ i }-${ j }`;
              if (dist < radius && !connMap.has(pairKey)) {
                // Assign a unique color to this line, persistent until the line is removed
                const lineColor = this.randomColor();
                connMap.set(pairKey, { i, j, lineColor });
                connectionCounts[i]++;
                connectionCounts[j]++;
              }
            });
          }
        }
      });

      // 3. Build particleLines from persistent connections
      for (const { i, j, lineColor } of connMap.values()) {
        const p1 = particleArray[i];
        const p2 = particleArray[j];
        if (!p1 || !p2) continue;
        const linePath = new Path2D();
        linePath.moveTo(p1.x, p1.y);
        linePath.lineTo(p2.x, p2.y);
        this.particleLines.push({ linePath, lineColor, lineWidth });
      }
    });
  }

  update() {
    this.particleArrays.forEach((particleArray, i) => {
      const shapePath = this.svgPaths[i];
      particleArray.forEach((particle) => {
        particle.update(this.ctx, shapePath);
      });
    });
    this.createLines();
  }

  render(ctx) {
    this.particleArrays.forEach((particleArray) => {
      particleArray.forEach((particle) => {
        particle.render(ctx);
      });
    });

    this.particleLines.forEach(({ linePath, lineColor, lineWidth }) => {
      ctx.save();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke(linePath);
      ctx.restore();
    });
  }
}

