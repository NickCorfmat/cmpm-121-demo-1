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

const upgradeButtons: HTMLButtonElement[] = [];

const gameName = "Toilet Clicker";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const button = document.createElement("button");
button.classList.add("toilet-clicker");
button.innerHTML = "🚽";
app.append(button);

const counterDisplay = document.createElement("div");
counterDisplay.id = "counter-display";
counterDisplay.innerHTML = `${counter} Poops`;
app.append(counterDisplay);

const statusDisplay = document.createElement("div");
statusDisplay.innerHTML = `Rate: ${growthRate}\nA: ${inventory.A}\nB: ${inventory.B}\nC: ${inventory.C}`;
app.append(statusDisplay);

button.addEventListener("click", (event) => {
  counter++;
  animatePoopEmoji(event.clientX, event.clientY);
});

requestAnimationFrame(increaseCounterRate);

// Citation: Brace, 10/10,24
// Prompt: i have this typescript code for a cookie clicker type game. However, it's long and redundant.
// Each upgrade would realistically cost different amunts and increment the growth rate by different
// amounts. How can I condense this logic using an interface?

interface Upgrade {
  index: string;
  text: string;
  cost: number;
  boost: number;
}

const upgrades: Upgrade[] = [
  { index: "A", text: "+0.1 poop/sec, Cost: 10", cost: 10, boost: 0.1 },
  { index: "B", text: "+2 poop/sec, Cost: 100", cost: 100, boost: 2 },
  { index: "C", text: "+50 poop/sec, Cost: 1000", cost: 1000, boost: 50 },
];

upgrades.forEach((upgrade) => {
  const upgradeButton = document.createElement("button");
  upgradeButton.innerHTML = upgrade.text;
  app.append(upgradeButton);

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
  statusDisplay.innerHTML = `Rate: ${truncateDecimals(growthRate, 1)} poops/sec<br>A: ${inventory.A}<br>B: ${inventory.B}<br>C: ${inventory.C}`;
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
    upgrade.text = `+${upgrade.boost} poop/sec, Cost: ${truncateDecimals(upgrade.cost, 1)}`;
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
