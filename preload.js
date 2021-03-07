// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};

const io = require("socket.io-client");
var socket = io("http://localhost:8000");

window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
  socket = io("http://localhost:8000");
});

window.addEventListener("click", () => {
  console.log("clicked");
  socket.emit("clicked");
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

socket.on("full", (data) => {
  console.log("full");
  replaceText("full", data.data); // undefined
  replaceText("partial", "");
});
socket.on("partial", (data) => {
  console.log("partial");
  replaceText("partial", data.data); // undefined
});
