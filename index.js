const {ipcRenderer} = require('electron');
const ipc = ipcRenderer;

const close = document.querySelector("[close]");
const minimize = document.querySelector("[minimize]");
const maximize = document.querySelector("[maximize]");
const main = document.querySelector("main.main");

close.addEventListener("click", () => {
    ipc.send("close");
});

minimize.addEventListener("click", () => {
    ipc.send("minimize");
});

maximize.addEventListener("click", () => {
    ipc.send("maximize");
});

main.addEventListener("mouseenter", () => {
    main.style.overflowY = "auto";
});

main.addEventListener("mouseleave", () => {
    main.style.overflowY = "hidden";
});