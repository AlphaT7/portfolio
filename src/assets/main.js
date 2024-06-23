import { loadAll } from "@tsparticles/all";

loadAll(tsParticles);

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
