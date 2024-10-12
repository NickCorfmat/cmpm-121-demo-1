import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "Toilet Clicker";
document.title = gameName;

// Interfaces
interface Item {
  name: string;
  description: string;
  cost: number;
  rate: number;
}

// Game state global variables
let counter: number = 0;
let growthRate: number = 0;
let lastTimeStamp: number = 0;
const inflationRate: number = 1.1;
const itemsPurchased = new Map<string, number>();

const availableItems: Item[] = [
  {
    name: "Dollar Store Plunger",
    description: "Your budget-friendly blockage busters!",
    cost: 10,
    rate: 0.5,
  },
  {
    name: "Neighborhood Plumber",
    description: "Your local plumber, not so reliable but gets the job done.",
    cost: 50,
    rate: 5,
  },
  {
    name: '"1-800-Sewage Squad"',
    description: "🎶 Night or day, we'll flush your troubles away! 🎵",
    cost: 250,
    rate: 35,
  },
  {
    name: "Dr. Flushenberg's Experimental Flush",
    description: "A mysterious lab-made invention of pure flush terror!",
    cost: 1250,
    rate: 150,
  },
  {
    name: "Call of the Latrine Legends",
    description: "Myths of the porcelain throne, no clog they can't handle.",
    cost: 6250,
    rate: 750,
  },
];

// DOM Elements list of item buttons
const itemButtons: HTMLButtonElement[] = [];

function createColumn(title: string): HTMLDivElement {
  const column = document.createElement("div");
  column.classList.add("column");

  const header = document.createElement("h1");
  header.innerHTML = title;
  column.appendChild(header);

  return column;
}

// Create a container with three columns: Upgrades, Toilet Clicker, and Stats
const container = document.createElement("div");
container.classList.add("container");
app.append(container);

// Initialize columns
const upgradesColumn = createColumn("Upgrades");
const clickerColumn = createColumn(gameName);
const statsColumn = createColumn("Stats");

container.append(upgradesColumn);
container.append(clickerColumn);
container.append(statsColumn);

// Initialize clicker button
const clickerButton = document.createElement("button");
clickerButton.classList.add("toilet-clicker");
clickerButton.innerHTML = "🚽";
clickerColumn.append(clickerButton);

// Initialize counter display
const counterDisplay = document.createElement("div");
counterDisplay.id = "counter-display";
counterDisplay.innerHTML = `${counter} Poops`;
clickerColumn.append(counterDisplay);

// Action to perform when toilet is clicked
clickerButton.addEventListener("click", (event) => {
  counter++;
  animatePoopEmoji(event.clientX, event.clientY);
});

// Initialize stats display
const rateDisplay = document.createElement("h2");
rateDisplay.innerHTML = `Production Rate:<br>${truncateDecimals(growthRate, 1)} poops/sec`;
statsColumn.append(rateDisplay);

const statusDisplay = document.createElement("div");
statsColumn.append(statusDisplay);

requestAnimationFrame(increaseCounterRate);

// Citation: Brace, 10/10,24
// Prompt: i have this typescript code for a cookie clicker type game. However, it's long and redundant.
// Each upgrade would realistically cost different amunts and increment the growth rate by different
// amounts. How can I condense this logic using an interface?

const buttonHover = document.createElement("div");
buttonHover.classList.add("buttonHover");
document.body.appendChild(buttonHover);

// Create DOM Buttons for each Item
availableItems.forEach((item) => {
  const itemButton = document.createElement("button");
  itemButton.classList.add("item");
  itemButton.innerHTML =
    item.name +
    `<br>+${item.rate} poop/sec, Cost: ${truncateDecimals(item.cost, 1)}`;
  upgradesColumn.append(itemButton);

  itemButtons.push(itemButton);

  // Mouse hovering over buttons
  // Citation: Brace, 10/11/24
  // Prompt: How can I make text hover over the cursor when I hover over a button?
  itemButton.addEventListener("mouseover", () => {
    buttonHover.innerHTML = item.description;
    buttonHover.style.visibility = "visible";
  });

  itemButton.addEventListener("mousemove", (event) => {
    buttonHover.style.left = `${event.pageX + 10}px`;
    buttonHover.style.top = `${event.pageY + 10}px`;
  });

  itemButton.addEventListener("mouseout", () => {
    buttonHover.style.visibility = "hidden";
  });

  itemButton.addEventListener("click", () => {
    if (counter >= item.cost) {
      counter -= item.cost;
      growthRate += item.rate;
      addToInventory(item.name, 1);
      increaseCostsBy(inflationRate);
      updateButtonStates();
    }
  });
});

function updateCounterDisplay(): void {
  counterDisplay.innerHTML = `${truncateDecimals(counter, 1)} poops`;
}

function updateStatsDisplay(): void {
  rateDisplay.innerHTML = `Production Rate:<br>${truncateDecimals(growthRate, 1)} poops/sec`;
  statusDisplay.innerHTML = "";

  itemsPurchased.forEach((value, key) => {
    statusDisplay.innerHTML += `${key}: ${value}<br>`;
  });
}

function updateButtonStates() {
  itemButtons.forEach((button, index) => {
    const item = availableItems[index];
    console.log(
      `Counter: ${counter}, Item Cost: ${item.cost}, Button Disabled: ${button.disabled}`,
    );
    button.disabled = counter < item.cost;
  });
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
  updateButtonStates();

  requestAnimationFrame(increaseCounterRate);
}

function increaseCostsBy(factor: number) {
  for (let i = 0; i < availableItems.length; i++) {
    availableItems[i].cost *= factor;
    itemButtons[i].innerHTML =
      availableItems[i].name +
      `<br>+${availableItems[i].rate} poop/sec, Cost: ${truncateDecimals(availableItems[i].cost, 1)}`;
  }
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

function addToInventory(itemKey: string, amount: number) {
  if (itemsPurchased.has(itemKey)) {
    const currentAmount = itemsPurchased.get(itemKey) || 0;
    itemsPurchased.set(itemKey, currentAmount + amount);
  } else {
    itemsPurchased.set(itemKey, amount);
  }
}
