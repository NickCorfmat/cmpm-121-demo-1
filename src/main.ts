import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

let counter: number = 0;
let growthRate: number = 0;
let lastTimeStamp: number = 0;

const gameName = "Poop Clicker";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const button = document.createElement("button");
button.innerHTML = "💩";
app.append(button);

const displayCount = document.createElement("div");
displayCount.textContent = `${counter} Poos`;
displayCount.id = "counter-display";
app.append(displayCount);

// manual clicker
button.addEventListener("click", () => {
  counter++;
  updateCounterText(counter);
});

// purchase upgrade button
const upgradeButton = document.createElement("button");
upgradeButton.innerHTML = "Upgrade";
app.append(upgradeButton);

upgradeButton.addEventListener("click", () => {
  if (counter >= 10) {
    counter -= 10;
    growthRate++;
  }
});

// increment counter rate

// Citation: Brace, 10/8/24
// Prompt: How would I increment a counter based on how much time has passed using requestAnimationFrame?
function increaseCounterRate(time: number) {
  if (lastTimeStamp === 0) lastTimeStamp = time;
  const elapsed = (time - lastTimeStamp) / 1000;
  lastTimeStamp = time;

  counter += elapsed * growthRate;
  updateCounterText(counter);

  // Citation: Brace, 10/8/24
  // Prompt: Explain the button disabling feature
  upgradeButton.disabled = counter < 10;

  requestAnimationFrame(increaseCounterRate);
}

requestAnimationFrame(increaseCounterRate);

function updateCounterText(count: number): void {
  displayCount.textContent = `${Math.floor(count)} Poos`;
}
