import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Toilet Clicker";
document.title = gameName;

// Global variables
let counter: number = 0;
let growthRate: number = 0;
let lastTimeStamp: number = 0;

const inventory: Inventory = { A: 0, B: 0, C: 0 };
const upgradeButtons: HTMLButtonElement[] = [];

// Interfaces
interface Inventory {
  A: number;
  B: number;
  C: number;
}

interface Upgrade {
  index: string;
  name: string;
  text: string;
  cost: number;
  boost: number;
}

// Column container
const container = document.createElement("div");
container.classList.add("container");
app.append(container);

// Upgrades Column
const upgradesColumn = document.createElement("div");
upgradesColumn.classList.add("column");
const upgradesHeader = document.createElement("h1");
upgradesHeader.innerHTML = "Upgrades";
upgradesColumn.append(upgradesHeader);
container.append(upgradesColumn);

// Clicker Column
const clickerColumn = document.createElement("div");
clickerColumn.classList.add("column");
const clickerHeader = document.createElement("h1");
clickerHeader.innerHTML = gameName;
clickerColumn.append(clickerHeader);
container.append(clickerColumn);

const clickerButton = document.createElement("button");
clickerButton.classList.add("toilet-clicker");
clickerButton.innerHTML = "🚽";
clickerColumn.append(clickerButton);

const counterDisplay = document.createElement("div");
counterDisplay.id = "counter-display";
counterDisplay.innerHTML = `${counter} Poops`;
clickerColumn.append(counterDisplay);

clickerButton.addEventListener("click", (event) => {
  counter++;
  animatePoopEmoji(event.clientX, event.clientY);
});

// Stats Column
const statsColumn = document.createElement("div");
statsColumn.classList.add("column");
const statsHeader = document.createElement("h1");
statsHeader.innerHTML = "Stats";
statsColumn.append(statsHeader);
container.append(statsColumn);

const rateDisplay = document.createElement("h2");
rateDisplay.innerHTML = `Production Rate:<br>${truncateDecimals(growthRate, 1)} poops/sec`;
statsColumn.append(rateDisplay);

const statusDisplay = document.createElement("div");
statusDisplay.innerHTML = `A: ${inventory.A}\nB: ${inventory.B}\nC: ${inventory.C}`;
statsColumn.append(statusDisplay);

requestAnimationFrame(increaseCounterRate);

// Citation: Brace, 10/10,24
// Prompt: i have this typescript code for a cookie clicker type game. However, it's long and redundant.
// Each upgrade would realistically cost different amunts and increment the growth rate by different
// amounts. How can I condense this logic using an interface?

const upgrades: Upgrade[] = [
  {
    index: "A",
    name: "Dollar Store Plunger",
    text: "",
    cost: 10,
    boost: 0.1,
  },
  {
    index: "B",
    name: "Professional Plumber",
    text: "",
    cost: 100,
    boost: 2,
  },
  {
    index: "C",
    name: "Sewage Squad",
    text: "",
    cost: 1000,
    boost: 50,
  },
];

upgrades.forEach((upgrade) => {
  const upgradeButton = document.createElement("button");
  upgradeButton.classList.add("upgrade");
  upgrade.text =
    upgrade.name +
    `<br>+${upgrade.boost} poop/sec, Cost: ${truncateDecimals(upgrade.cost, 1)}`;
  upgradeButton.innerHTML = upgrade.text;
  upgradesColumn.append(upgradeButton);

  upgradeButtons.push(upgradeButton);

  upgradeButton.addEventListener("click", () => {
    if (counter >= upgrade.cost) {
      counter -= upgrade.cost;
      growthRate += upgrade.boost;
      inventory[upgrade.index as keyof Inventory] += 1;

      increaseCostsBy(1.15);
    }
  });
});

function updateCounterDisplay(): void {
  counterDisplay.innerHTML = `${truncateDecimals(counter, 1)} Poops`;
}

function updateStatsDisplay(): void {
  rateDisplay.innerHTML = `Production Rate:<br>${truncateDecimals(growthRate, 1)} poops/sec`;
  statusDisplay.innerHTML = `Dollar Store Plungers: ${inventory.A}<br>Professional Plumbers: ${inventory.B}<br>Sewage Squads: ${inventory.C}`;
}

// Citation: Brace, 10/8/24
// Prompt: How would I increment a counter based on how much time has passed using requestAnimationFrame?
function increaseCounterRate(time: number) {
  if (lastTimeStamp === 0) lastTimeStamp = time;
  const elapsed = (time - lastTimeStamp) / 1000;
  lastTimeStamp = time;

  counter += elapsed * growthRate;
  updateCounterDisplay();
  updateStatsDisplay();

  requestAnimationFrame(increaseCounterRate);
}

function increaseCostsBy(factor: number) {
  upgrades.forEach((upgrade, index) => {
    upgrade.cost *= factor;
    upgrade.text =
      upgrade.name +
      `<br>+${upgrade.boost} poop/sec, Cost: ${truncateDecimals(upgrade.cost, 1)}`;
    upgradeButtons[index].innerHTML = upgrade.text;
  });
}

// Citation: Brace, 10/10/24
// Prompt: I want to animate a poop emoji when I click the toilet button. How do I animate this using typescript, HTML, and CSS?
function animatePoopEmoji(x: number, y: number) {
  const poopEmoji = document.createElement("div");
  poopEmoji.innerHTML = "💩";
  poopEmoji.classList.add("poop-emoji");
  document.body.appendChild(poopEmoji);

  poopEmoji.style.left = `${x}px`;
  poopEmoji.style.top = `${y}px`;

  setTimeout(() => {
    poopEmoji.style.transform = "translateY(-200px)";
    poopEmoji.style.opacity = "0";
  }, 0);

  setTimeout(() => {
    poopEmoji.remove();
  }, 1000);
}

// Code inspired from StackOverflow, https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
function truncateDecimals(number: number, digits: number) {
  return Math.floor(number * Math.pow(10, digits)) / Math.pow(10, digits);
}
