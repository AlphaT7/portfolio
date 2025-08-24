import Animation from "./modules/animation.js";
import Particles from "./modules/particles.js";

let animationObjects = {};

onmessage = async (e) => {
    switch (e.data.type) {
        case "initialize":
            const canvasData = e.data.canvasData;
            const particles = new Particles({ canvasData: canvasData });
            animationObjects = { particles };

            await particles.load();

            const animation = new Animation({ canvasData, animationObjects });

            animation.loop.start();

            break;

        case "pointerdown":
            animationObjects.particles.pointer.x = e.data.pointer.x;
            animationObjects.particles.pointer.y = e.data.pointer.y;
            break;

        default:
            console.log("Unknown message type:", e.data.type);
            break;
    }
}


