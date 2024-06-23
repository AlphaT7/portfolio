import { loadAll } from "@tsparticles/all";

loadAll(tsParticles);

function animateSVG() {
  tsParticles
    .load({
      id: "tsparticles",
      url: "./config.polygon.json",
    })
    .then((container) => {
      setTimeout(() => {
        animateSVG();
      }, 30000);
    })
    .catch((error) => {
      console.error(error);
    });
}

animateSVG();
