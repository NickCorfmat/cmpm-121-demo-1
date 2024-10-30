import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// Interfaces
interface Item {
  name: string;
  desc: string;
  cost: number;
  rate: number;
}

// Global Variables
let counter: number = 0;
let growthRate: number = 0;
let lastTimeStamp: number = 0;

const inflationRate: number = 1.1;
const itemsPurchased = new Map<string, number>();

const availableItems: Item[] = [
  {
    name: "Dollar Store Plunger",
    desc: "Your budget-friendly blockage busters!",
    cost: 10,
    rate: 0.5,
  },
  {
    name: "Neighborhood Plumber",
    desc: "Your local plumber, not so reliable but gets the job done.",
    cost: 50,
    rate: 5,
  },
  {
    name: '"1-800-Sewage Squad"',
    desc: "🎶 Night or day, we'll flush your troubles away! 🎵",
    cost: 250,
    rate: 35,
  },
  {
    name: "Dr. Flushenberg's Experimental Flush",
    desc: "A mysterious lab-made invention of pure flush terror!",
    cost: 1250,
    rate: 150,
  },
  {
    name: "Call of the Latrine Legends",
    desc: "Myths of the porcelain throne, no clog they can't handle.",
    cost: 6250,
    rate: 750,
  },
];

// DOM Elements
const gameName = "Toilet Clicker";
document.title = gameName;

const itemButtons: HTMLButtonElement[] = [];

const container = document.createElement("div");
container.classList.add("container");
app.append(container);

const upgradesColumn = createColumn("Upgrades");
const clickerColumn = createColumn(gameName);
const statsColumn = createColumn("Stats");

function createColumn(title: string): HTMLDivElement {
  const column = document.createElement("div");
  column.classList.add("column");

  const header = document.createElement("h1");
  header.innerHTML = title;
  column.appendChild(header);

  return column;
}

container.append(upgradesColumn);
container.append(clickerColumn);
container.append(statsColumn);

// create toilet clicker button
const clickerButton = document.createElement("button");
clickerButton.classList.add("toilet-clicker");
clickerButton.innerHTML = "🚽";
clickerColumn.append(clickerButton);

// create counter display
const counterDisplay = document.createElement("div");
counterDisplay.id = "counter-display";
clickerColumn.append(counterDisplay);

// action to perform when toilet is clicked
clickerButton.addEventListener("click", (event) => {
  counter++;
  animateEmojiOnClick(event.clientX, event.clientY);
});

// create stats displays
const rateDisplay = document.createElement("h2");
statsColumn.append(rateDisplay);

const statusDisplay = document.createElement("div");
statsColumn.append(statusDisplay);

// stats display helpers
function updateCounterDisplay(): void {
  counterDisplay.innerHTML = `${truncateDecimals(counter, 1)} 💩`;
}

function updateStatsDisplay(): void {
  rateDisplay.innerHTML = `Production Rate:<br>${truncateDecimals(growthRate, 1)} 💩/sec`;
  statusDisplay.innerHTML = "";

  itemsPurchased.forEach((value, key) => {
    statusDisplay.innerHTML += `${key}: ${value}<br>`;
  });
}

function updateButtonVisibility() {
  itemButtons.forEach((button, index) => {
    const item = availableItems[index];
    button.disabled = counter < item.cost;
  });
}

// upgrade button helpers
const buttonHover = document.createElement("div");
buttonHover.classList.add("buttonHover");
document.body.appendChild(buttonHover);

function onUpgradeButtonMouseHover(item: Item): void {
  buttonHover.innerHTML = item.desc;
  buttonHover.style.visibility = "visible";
}

function onUpgradeButtonMouseMove(event: MouseEvent): void {
  buttonHover.style.left = `${event.pageX + 10}px`;
  buttonHover.style.top = `${event.pageY + 10}px`;
}

function onUpgradeButtonMouseOut(): void {
  buttonHover.style.visibility = "hidden";
}

function onUpgradeButtonClick(item: Item): void {
  if (counter >= item.cost) {
    counter -= item.cost;
    growthRate += item.rate;

    addItemToInventory(item.name, 1);
    increaseItemCostsBy(inflationRate);
    updateButtonVisibility();
  }
}

function createUpgradeButton(item: Item): HTMLButtonElement {
  const itemButton = document.createElement("button");
  setUpgradeButtonHTML(itemButton, item);

  return itemButton;
}

function setUpgradeButtonHTML(button: HTMLButtonElement, item: Item): void {
  button.classList.add("item");
  button.innerHTML =
    item.name +
    `<br>+${item.rate} 💩/sec, Cost: ${truncateDecimals(item.cost, 1)} 💩`;

  upgradesColumn.appendChild(button);
}

function setUpgradeButtonListeners(
  button: HTMLButtonElement,
  item: Item,
): void {
  button.addEventListener("mouseover", () => onUpgradeButtonMouseHover(item));
  button.addEventListener("mousemove", (event) =>
    onUpgradeButtonMouseMove(event),
  );
  button.addEventListener("mouseout", () => onUpgradeButtonMouseOut());
  button.addEventListener("click", () => onUpgradeButtonClick(item));
}

// create upgrade buttons
availableItems.forEach((item) => {
  const itemButton = createUpgradeButton(item);
  itemButtons.push(itemButton);

  setUpgradeButtonListeners(itemButton, item);
});

// Citation: Brace, 10/10/24, How do I animate text using typescript?
function animateEmojiOnClick(x: number, y: number) {
  const emoji = document.createElement("div");
  emoji.innerHTML = "💩";
  emoji.classList.add("poop-emoji");
  document.body.appendChild(emoji);

  emoji.style.left = `${x}px`;
  emoji.style.top = `${y}px`;

  setTimeout(() => {
    emoji.style.transform = "translateY(-200px)";
    emoji.style.opacity = "0";
  }, 0);

  setTimeout(() => {
    emoji.remove();
  }, 1000);
}

// Game Functions
function increaseCounterRate(time: number) {
  const elapsed = calculateElapsedTime(time);
  counter += elapsed * growthRate;

  refreshUI();
  requestAnimationFrame(increaseCounterRate);
}

function calculateElapsedTime(currentTime: number): number {
  if (lastTimeStamp === 0) lastTimeStamp = currentTime;

  const elapsed = (currentTime - lastTimeStamp) / 1000;
  lastTimeStamp = currentTime;
  return elapsed;
}

function refreshUI(): void {
  updateCounterDisplay();
  updateStatsDisplay();
  updateButtonVisibility();
}

function increaseItemCostsBy(factor: number) {
  availableItems.forEach((item, index) => {
    item.cost *= factor;
    itemButtons[index].innerHTML =
      `${item.name}<br>+${item.rate} 💩/sec, Cost: ${truncateDecimals(item.cost, 1)}`;
  });
}

function addItemToInventory(itemKey: string, amount: number): void {
  const currentAmount = itemsPurchased.get(itemKey) || 0;
  itemsPurchased.set(itemKey, currentAmount + amount);
}

function truncateDecimals(number: number, digits: number) {
  return Math.floor(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

requestAnimationFrame(increaseCounterRate);
