export default class Animation {
    /* worker.js Animation class */
    constructor({ canvasData, animationObjects }) {
        this.animationObjects = animationObjects;
        this.canvas = canvasData.offScreenCanvas;
        this.ctx = this.canvas.getContext("2d");
    }

    loop = {
        lastTick: performance.now(),

        frame: {},
        start: () => {

            this.loop.frame = requestAnimationFrame(
                this.loop.tick
            );
        },
        stop: () => {
            window.cancelAnimationFrame(this.loop.frame);
        },
        update: () => {
            for (let obj in this.animationObjects) {
                this.animationObjects[obj].update();
            }
        },
        render: (ctx) => {
            for (let obj in this.animationObjects) {
                this.animationObjects[obj].render(ctx);
            }
        },
        tick: (now) => {
            const fps = 60;
            const frameDuration = 1000 / fps; // ~16.67ms
            if (now - this.loop.lastTick >= frameDuration) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.save();
                this.loop.update(this.ctx);
                this.loop.render(this.ctx);
                this.loop.lastTick = now;
                this.ctx.restore();
            }
            this.loop.frame = requestAnimationFrame(
                this.loop.tick
            );
        }
    };
}