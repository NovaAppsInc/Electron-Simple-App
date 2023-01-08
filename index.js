const {ipcRenderer} = require('electron');
const ipc = ipcRenderer;

const close = document.querySelector("[close]");
const minimize = document.querySelector("[minimize]");
const maximize = document.querySelector("[maximize]");
const main = document.querySelector("main.main");

const buttons = document.querySelectorAll("button");

for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", () => {
        if(button.getAttribute("action")) {
            let action = button.getAttribute("action");
            let actionType = action.split("[")[1].split("]")[0];
            let actionValuesList = action.split("(")[1].split(")")[0];
            let actionTitle = actionValuesList.split(",")[0];
            let actionValue = actionValuesList.split(",")[1];

            if(actionTitle == undefined || actionTitle == "") {
                console.error(`Title is not defined\n\nDefine a title by setting%c action="[actionType](title, message]"`, `color: #ffe433;`);
                console.error(`A good example would be:%c action="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                if(actionValue == undefined || actionValue == "") {
                    console.error(`Message is not defined\n\nDefine a message by setting%c action="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be:%c action="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                if(actionType == undefined || actionType == "") {
                    console.error(`Action Type is not defined\n\nDefine an action type by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be: %caction="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                return
            }

            if(actionValue == undefined || actionValue == "") {
                console.error(`Message is not defined\n\nDefine a message by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                console.error(`A good example would be: %caction="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                if(actionTitle == undefined || actionTitle == "") {
                    console.error(`Title is not defined\n\nDefine a title by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be:%c action="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                if(actionType == undefined || actionType == "") {
                    console.error(`Action Type is not defined\n\nDefine an action type by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be:%caction="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                return
            }

            if(actionType == undefined || actionType == "") {
                console.error(`Action Type is not defined\n\nDefine an action type by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                console.error(`A good example would be:%caction="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                if(actionTitle == undefined || actionTitle == "") {
                    console.error(`Title is not defined\n\nDefine a title by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be:%c action="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                if(actionValue == undefined || actionValue == "") {
                    console.error(`Message is not defined\n\nDefine a message by setting %caction="[actionType](title, message]"`, `color: #ffe433;`);
                    console.error(`A good example would be:%c action="[ask](Enter Your Name, What is your name?"`, `color: #ffe433;`);
                }
                return
            }

            if(actionType == "ask") {
                ipc.send("prompt", {
                    type: actionType,
                    title: actionTitle,
                    value: actionValue,
                    inputMessage: "Enter your name",
                    promptSubmitContent: "Submit",
                    promptCancelContent: "Cancel"
                });
            } else if(actionType == "alert") {
                if(actionValue.includes("**")) {
                    let boldText = actionValue.split("**")[1];
                    actionValue = actionValue.replace(`**${boldText}**`, `<b>${boldText}</b>`);
                }
                ipc.send("prompt", {
                    type: actionType,
                    title: actionTitle,
                    value: actionValue,
                    alertOkContent: "OK"
                });
            }
        }
    })
}

ipc.on("prompt-submit", (event, arg) => {
    alert(`Hello ${arg}!`);
})

ipc.on("prompt-cancel", () => {
    alert("Prompt Cancelled");
})

close.addEventListener("click", () => {
    ipc.send("close");
});

minimize.addEventListener("click", () => {
    ipc.send("minimize");
});

maximize.addEventListener("click", () => {
    ipc.send("maximize");
});