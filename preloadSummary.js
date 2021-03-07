// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};
const foundKeyWords = [];

let welcome = {
  keyword: "stenotes",
  title: "Thanks for using Stenotes!",
  url: "https://devpost.com/software/stenotes",
  summary: "Key topics from what you're listening to will appear below.",
};

const OpenURL = (url) => {
  require("electron").shell.openExternal(url);
};

const UpdateSummary = (data) => {
  const summaryContainer = document.getElementById("summary-container");
  if (foundKeyWords.includes(data.title)) return;
  foundKeyWords.push(data.title);
  // Create card element
  const card = document.createElement("div");
  card.classList = "card-body";

  // Construct card content
  const content = `
    <div class="card">

      <div class="card-body">
        <a href="${data.url}"><h5>${data.title}</h5></a>
        <p>${data.summary}</p>
        ...
      </div>
    </div>
  `;

  // Append newyly created card element to the container
  summaryContainer.innerHTML += content;
};

const io = require("socket.io-client");
var socket = io("http://localhost:8000");

window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
  socket = io("http://localhost:8000");
  UpdateSummary(welcome);
});

socket.on("connect", () => {
  console.log("socket.id"); // x8WIv7-mJelg7on_ALbx
});

socket.on("serverResponse", () => {
  console.log("omegalearn"); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  socket = io("http://localhost:8000");
  console.log("disconnected"); // undefined
});
socket.on("summary", (data) => {
  console.log("summary");
  console.log(data);
  UpdateSummary(data.data);
});
