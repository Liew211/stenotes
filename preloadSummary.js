// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};
const foundKeyWords = [];
const UpdateSummary = (data) => {
  const summaryContainer = document.getElementById('summary-container');
  if(foundKeyWords.includes(data.title))return;
  foundKeyWords.push(data.title);
  // Create card element
  const card = document.createElement('div');
  card.classList = 'card-body';
  
  // Construct card content
  const content = `
    <div class="card">
    <div class="card-header" id="heading-${data.title}">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse-${data.title}" aria-expanded="true" aria-controls="collapse-${data.title}">

        </button>
      </h5>
    </div>

    <div id="collapse-${data.title}" class="collapse show" aria-labelledby="heading-${data.title}" data-parent="#accordion">
      <div class="card-body">
        <a href="${data.url}" target="_blank"><h5>${data.title}</h5></a>
        <p>${data.summary}</p>
        ...
      </div>
    </div>
  </div>
  `;

  // Append newyly created card element to the container
  summaryContainer.innerHTML += content;
}

window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

const io = require("socket.io-client");
const socket =  io("http://localhost:8000");

socket.on("connect", () => {
  console.log("socket.id"); // x8WIv7-mJelg7on_ALbx
});

socket.on("serverResponse", () => {
  console.log("omegalearn"); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log("disconnected"); // undefined
});
socket.on("summary", (data) => {
  console.log("summary");
  console.log(data);
  UpdateSummary(data.data);
});