import { loadAll } from "@tsparticles/all";

loadAll(tsParticles);

function animateSVG() {
  tsParticles
    .load({
      id: "tsparticles",
      url: "./config.polygon.json",
    })
    .then((container) => {
      console.log("callback - tsparticles config loaded");
    })
    .catch((error) => {
      console.error(error);
    });
  setTimeout(() => {
    animateSVG();
  }, 30000);
}

animateSVG();
