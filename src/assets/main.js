import { Howl } from "howler";
let userInteraction = false;

async function typeIt(elId, text, sound) {
  for (let char of text) {
    document.getElementById(elId).innerHTML += char;
    sound.play();
    let time = Math.floor(Math.random() * 60) + 16;
    await new Promise((resolve) => setTimeout(resolve, time));
  }
}

document.addEventListener("pointerup", (e) => {
  if (userInteraction) return;

  function play() {
    let text =
      "Self-taught web developer, casual gamer, husband and father of 4";
    let mediaQuery = window.matchMedia("(max-width: 700px)").matches;

    if (mediaQuery) {
      typeIt("mobileDescription", text, sound);
    } else {
      typeIt("desktopDescription", text, sound);
    }

    userInteraction = true;
  }

  const sound = new Howl({
    src: ["sound/typeEffect.mp3"],
    onload: () => {
      play();
    },
  });
});
