import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

let counter: number = 0;

const gameName = "Super Awesome Bros.";
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

button.addEventListener("click", () => {
  counter++;
  displayCount.textContent = `${counter} Poos`;
});
