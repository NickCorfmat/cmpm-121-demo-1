import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

let counter: number = 0;
let growthRate: number = 0;
let lastTimeStamp: number = 0;

interface Inventory {
  A: number;
  B: number;
  C: number;
}

const inventory: Inventory = { A: 0, B: 0, C: 0 };

const gameName = "Poop Clicker";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const button = document.createElement("button");
button.innerHTML = "💩";
app.append(button);

const counterDisplay = document.createElement("div");
counterDisplay.innerHTML = `${counter} Poos`;
counterDisplay.id = "counter-display";
app.append(counterDisplay);

const statusDisplay = document.createElement("div");
statusDisplay.innerHTML = `Rate: ${growthRate}\nA: ${inventory.A}\nB: ${inventory.B}\nC: ${inventory.C}`;
app.append(statusDisplay);

// Manual clicker
button.addEventListener("click", () => {
  counter++;
});

requestAnimationFrame(increaseCounterRate);

/*** Upgrades ***/

// Citation: Brace, 10/10,24
// Prompt: i have this typescript code for a cookie clicker type game. However, it's long and redundant.
// Each upgrade would realistically cost different amunts and increment the growth rate by different
// amounts. How can I condense this logic using an interface?

interface Upgrade {
  name: string;
  text: string;
  cost: number;
  boost: number;
}

const upgrades: Upgrade[] = [
  { name: "A", text: "+0.1 poop/sec, Cost: 10", cost: 10, boost: 0.1 },
  { name: "B", text: "+2 poop/sec, Cost: 100", cost: 100, boost: 2 },
  { name: "C", text: "+50 poop/sec, Cost: 1000", cost: 1000, boost: 50 },
];

upgrades.forEach((upgrade) => {
  const upgradeButton = document.createElement("button");
  upgradeButton.innerHTML = upgrade.text;
  app.append(upgradeButton);

  upgradeButton.addEventListener("click", () => {
    if (counter >= upgrade.cost) {
      counter -= upgrade.cost;
      growthRate += upgrade.boost;
      inventory[upgrade.name as keyof Inventory] += 1;
    }
  });
});

/*** Helper Functions ***/
function updateCounterDisplay(): void {
  counterDisplay.innerHTML = `${Math.floor(counter)} Poops`;
}

function updateStatsDisplay(): void {
  statusDisplay.innerHTML = `Rate: ${Math.floor(growthRate * 10) / 10} poops/sec<br>A: ${inventory.A}<br>B: ${inventory.B}<br>C: ${inventory.C}`;
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
