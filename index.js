let cursorElements = document.querySelectorAll("#cursor > *");
let circle = document.querySelector("#cursor > .large-circle");
let particlesContainer = document.querySelector("#particles");
let links = document.querySelectorAll("a");

let cursorTimeout;

const startCursorTimeout = () => {
  cursorElements.forEach((element) => element.classList.remove("hidden"));
  cursorTimeout = setTimeout(
    () => cursorElements.forEach((element) => element.classList.add("hidden")),
    5e3
  );
};

var cumulatedDistance = 0;
let randomGap = (maxGap) => Math.floor(Math.random() * maxGap - maxGap / 2);
const createParticles = (e) => {
  cumulatedDistance += (mouseStats.speed / 100) * mouseStats.time;
  if (cumulatedDistance > 10) {
    let particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.setProperty("left", `${e.clientX + randomGap(5)}px`);
    particle.style.setProperty("top", `${e.clientY + randomGap(5)}px`);
    /**
     * with a geometrical shape for a better effect (the particle rotates):
     * particle.style.setProperty(
     * "transform",
     * `translate(-50%, -50%) rotate(${Math.round(Math.random() * 360)}deg)`
     * );
     */

    particlesContainer.append(particle);

    setTimeout(() => {
      particle.style.setProperty(
        "left",
        `calc(${particle.style.left} + ${randomGap(30)}px)`
      );
      particle.style.setProperty(
        "top",
        `calc(${particle.style.top} + ${randomGap(30)}px)`
      );
      particle.style.setProperty("width", "0");
      particle.style.setProperty("height", "0");
      /**
       * with a geometrical shape for a better effect (the particle rotates):
       * particle.style.setProperty(
       * "transform",
       * `translate(-50%, -50%) rotate(${Math.round(Math.random() * 360)}deg)`
       * );
       */
      particle.style.setProperty("opacity", "0");
      setTimeout(() => particlesContainer.removeChild(particle), 500);
    }, 50);
    cumulatedDistance = 0;
  }
};

var mouseStats = {
  timestamp: null,
  lastPosition: null,
  speed: null,
  time: null,
  distance: null,
  mouseDown: false,
};

window.addEventListener("mousemove", (e) => {
  if (mouseStats.timestamp === null) {
    mouseStats.timestamp = Date.now();
    mouseStats.lastPosition = { x: e.clientX, y: e.clientY };
    return;
  }

  let now = Date.now();
  mouseStats.distance = Math.sqrt(
    Math.pow(mouseStats.lastPosition.x - e.clientX, 2) +
      Math.pow(mouseStats.lastPosition.y - e.clientY, 2)
  );
  mouseStats.time = now - mouseStats.timestamp;
  mouseStats.speed = Math.round((mouseStats.distance / mouseStats.time) * 100);

  mouseStats.timestamp = now;
  mouseStats.lastPosition = { x: e.clientX, y: e.clientY };
});
window.addEventListener("mousemove", (e) => {
  e.preventDefault();
  clearTimeout(cursorTimeout);

  if (mouseStats.mouseDown) createParticles(e);

  cursorElements.forEach((element) => {
    element.style.setProperty(
      "transform",
      `translate(${e.clientX}px, ${e.clientY}px)`
    );
  });

  startCursorTimeout();
});

document.addEventListener("mousedown", (e) => {
  e.preventDefault();
  cursorElements.forEach((element) => element.classList.add("click"));

  mouseStats.mouseDown = true;
});
document.addEventListener("mouseup", (e) => {
  e.preventDefault();
  mouseStats.mouseDown = false;
  cursorElements.forEach((element) => element.classList.remove("click"));
  document.onmousemove = () => {};
});
document.addEventListener("click", (e) => {
  e.preventDefault();
  clearTimeout(cursorTimeout);
  startCursorTimeout();
});

document.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  cursorElements.forEach((element) => element.classList.add("hidden"));
});
document.addEventListener("mouseenter", (e) => {
  e.preventDefault();
  cursorElements.forEach((element) => element.classList.remove("hidden"));
});

let particlesInterval;

links.forEach((element) => {
  element.addEventListener("mouseenter", (e) => {
    e.preventDefault();
    cursorElements.forEach((element) => element.classList.add("hover"));
    particlesInterval = setInterval(() => createParticles(e), 10);
  });
});
links.forEach((element) => {
  element.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    cursorElements.forEach((element) => element.classList.remove("hover"));
    clearInterval(particlesInterval);
  });
});

let setMainWidth = () =>
  document
    .getElementById("main")
    .style.setProperty("width", `${window.innerWidth / 1.618}px`);

window.addEventListener(
  "load",
  () => {
    setMainWidth();
  },
  { once: true }
);
window.addEventListener("resize", () => {
  setMainWidth();
});
