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

const displayCount = document.createElement("div");
displayCount.textContent = `${counter} Poos`;
displayCount.id = "counter-display";
app.append(displayCount);

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
  buttonText: string;
  cost: number;
  boostRate: number;
}

const upgrades: Upgrade[] = [
  { name: "A", buttonText: "+0.1 p/s, Cost: 10", cost: 10, boostRate: 0.1 },
  { name: "B", buttonText: "+2 p/s, Cost: 100", cost: 100, boostRate: 2 },
  { name: "C", buttonText: "+50 p/s, Cost: 1000", cost: 1000, boostRate: 50 },
];

upgrades.forEach((upgrade) => {
  const upgradeButton = document.createElement("button");
  upgradeButton.innerHTML = upgrade.buttonText;
  app.append(upgradeButton);

  upgradeButton.addEventListener("click", () => {
    if (counter >= upgrade.cost) {
      counter -= upgrade.cost;
      growthRate += upgrade.boostRate;
      inventory[upgrade.name as keyof Inventory] += 1;
    }
  });
});

/*** Helper Functions ***/
function updateText(): void {
  displayCount.textContent = `${Math.floor(counter)} Poos`;
  //displayRate.textContent = `Current Growth Rate: ${growthRate}\n`;
  //displayInventory.textContent = `Upgrades Owned:\nA: ${inventory.A}\nB: ${inventory.B}\nC: ${inventory.C}`;
}

// Citation: Brace, 10/8/24
// Prompt: How would I increment a counter based on how much time has passed using requestAnimationFrame?
function increaseCounterRate(time: number) {
  if (lastTimeStamp === 0) lastTimeStamp = time;
  const elapsed = (time - lastTimeStamp) / 1000;
  lastTimeStamp = time;

  counter += elapsed * growthRate;
  updateText();

  requestAnimationFrame(increaseCounterRate);
}
