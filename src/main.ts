import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

let counter: number = 0;
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

// increment counter rate

// Citation: Brace Conversation, 10/8/24
// Question: How would I increment a counter based on how much time has passed using requestAnimationFrame?
function increaseCounterRate(time: number) {
  if (lastTimeStamp === 0) lastTimeStamp = time;
  const elapsed = (time - lastTimeStamp) / 1000;
  lastTimeStamp = time;

  counter += elapsed;
  updateCounterText(counter);

  requestAnimationFrame(increaseCounterRate);
}

requestAnimationFrame(increaseCounterRate);

function updateCounterText(count: number): void {
  displayCount.textContent = `${Math.floor(count)} Poos`;
}
