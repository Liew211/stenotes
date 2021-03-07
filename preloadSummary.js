// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};
const foundKeyWords = [];

let olympicData = {'keyword': 'olympics', 'title': 'Olympic Games', 'url': 'https://en.wikipedia.org/wiki/Olympic Games', 'summary': 'The modern Olympic Games or Olympics (French: Jeux olympiques) are leading international sporting events featuring summer and wi...'}

const OpenURL = (url) => {
  require('electron').shell.openExternal(url);
}

const UpdateSummary = (data) => {
  const summaryContainer = document.getElementById('summary-container');
  if(foundKeyWords.includes(data.title))return;
  foundKeyWords.push(data.title);
  // Create card element
  const card = document.createElement('div');
  card.classList = 'card-body';
  
  // Construct card content
  const content = `
    <div class="card" id="card-${data.title}">
    <div class="card-header" id="heading-${data.title}">
      <h5 class="mb-0">
        <button>
        </button>
      </h5>
    </div>

    <div id="collapse-${data.title}" >
      <div class="card-body">
        <a target="_blank"><h5>${data.title}</h5></a>
        <p>${data.summary}</p>
        ...
      </div>
    </div>
  </div>
  `;

  // Append newyly created card element to the container
  summaryContainer.innerHTML += content;
  document.getElementById("card-" + data.title).addEventListener("click", OpenURL(data.url));
}

const io = require("socket.io-client");
var socket =  io("http://localhost:8000");

window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
  socket =  io("http://localhost:8000");
  UpdateSummary(olympicData);
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