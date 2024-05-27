async function typeIt(elId, text) {
  for (let char of text) {
    document.getElementById(elId).innerHTML += char;
    await new Promise((resolve) => setTimeout(resolve, 75));
  }
}

typeIt(
  "mobileDescription",
  "Self-taught web developer, casual gamer, husband and father of 4."
);
typeIt(
  "desktopDescription",
  "Self-taught web developer, casual gamer, husband and father of 4."
);
