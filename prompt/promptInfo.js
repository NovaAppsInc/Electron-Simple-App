const {ipcRenderer} = require('electron');
const ipc = ipcRenderer;

const close = document.querySelector("[close]");

ipc.on("prompt-args", (event, args) => {
    close.addEventListener("click", () => {
        if(args.type === "ask") {
            ipc.send("prompt-cancel");
        } else if(args.type === "alert") {
            ipc.send("prompt-close");
        }
    });
    const title = document.querySelector("[prompt-title]");
    const content = document.querySelector("[prompt-content]");
    if(args.type === "ask") {
        title.innerHTML = `
            <svg icon width="20" height="35" viewBox="0 0 20 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.83965 24.5028C8.31515 24.5028 7.82542 24.2405 7.53486 23.8038V23.8038C7.18636 23.2801 7.00255 22.6629 7.0077 22.0338C7.01807 20.7668 7.04383 20.351 7.38352 19.3409C7.79735 18.1103 8.38542 17.1139 9.14773 16.3516C9.91004 15.5893 10.8248 14.8868 11.892 14.2443C12.5346 13.8523 13.1117 13.3894 13.6236 12.8558C14.1354 12.3113 14.5384 11.6851 14.8324 10.9773C15.1373 10.2694 15.2898 9.48532 15.2898 8.625C15.2898 7.55777 15.0393 6.6321 14.5384 5.84801C14.0374 5.06392 13.3677 4.45952 12.5291 4.0348C11.6906 3.61008 10.7595 3.39773 9.7358 3.39773C8.8428 3.39773 7.98248 3.58286 7.15483 3.95312C6.32718 4.32339 5.63565 4.90601 5.08026 5.701C4.81872 6.07535 4.6091 6.50404 4.4514 6.98707C4.12489 7.98718 3.29954 8.82102 2.24748 8.82102H2.09633C0.954852 8.82102 0.0189208 7.85698 0.287826 6.74763C0.527982 5.75688 0.911207 4.86349 1.4375 4.06747C2.3196 2.74976 3.4794 1.74242 4.9169 1.04545C6.36529 0.348485 7.97159 0 9.7358 0C11.6525 0 13.3187 0.381155 14.7344 1.14347C16.161 1.90578 17.2609 2.95123 18.0341 4.27983C18.8182 5.60843 19.2102 7.12216 19.2102 8.82102C19.2102 10.0189 19.0251 11.1025 18.6548 12.0717C18.2955 13.041 17.7727 13.9067 17.0866 14.669C16.4115 15.4313 15.5947 16.1065 14.6364 16.6946C13.678 17.2936 12.9103 17.9252 12.3331 18.5895C11.7559 19.2429 11.3366 20.0215 11.0753 20.9254C10.8883 21.572 10.888 22.1759 10.8951 22.9616C10.9007 23.5909 10.5164 24.1532 9.93278 24.3889V24.3889C9.74638 24.4641 9.54723 24.5028 9.3462 24.5028H8.83965ZM8.82102 34.1733C8.01515 34.1733 7.32363 33.8847 6.74645 33.3075C6.16927 32.7304 5.88068 32.0388 5.88068 31.233C5.88068 30.4271 6.16927 29.7356 6.74645 29.1584C7.32363 28.5812 8.01515 28.2926 8.82102 28.2926C9.62689 28.2926 10.3184 28.5812 10.8956 29.1584C11.4728 29.7356 11.7614 30.4271 11.7614 31.233C11.7614 31.7666 11.6252 32.2566 11.353 32.7031C11.0916 33.1496 10.7377 33.509 10.2912 33.7812C9.85559 34.0426 9.36553 34.1733 8.82102 34.1733Z" fill="#43B65C"/>
            </svg>
            <div title-text>${args.title}</div>
        `;
        content.innerHTML = `
            <div input-container>
                <div message>${args.value}</div>
                <input type="text" prompt-input value="${args.inputMessage}" />
            </div>
            <div button-container>
                <button prompt-button action="prompt[submit]">
                    ${args.promptSubmitContent}
                </button>
                <button prompt-button action="prompt[cancel]">
                    ${args.promptCancelContent}
                </button>
            </div>
        `;
        const input = document.querySelector("[prompt-input]");
        input.addEventListener("focus", () => {
            if(input.value === args.inputMessage) {
                input.value = "";
            }
        })
        input.addEventListener("blur", () => {
            if(input.value === "") {
                input.value = args.inputMessage;
            }
        })
        input.addEventListener("keyup", (e) => {
            if(e.key === "Enter") {
                if(input.value !== args.inputMessage && input.value !== "") {
                    ipc.send("prompt-submit", input.value);
                }
            }
        })
        const promptButtons = document.querySelectorAll("[prompt-button]");
        for (let i = 0; i < promptButtons.length; i++) {
            const promptButton = promptButtons[i];
            promptButton.addEventListener("click", () => {
                if(promptButton.getAttribute("action")) {
                    let action = promptButton.getAttribute("action");
                    let actionType = action.split("[")[1].split("]")[0];
                    if(actionType === "submit") {
                        let input = document.querySelector("[prompt-input]");
                        if(input.value !== args.inputMessage && input.value !== "") {
                            ipc.send("prompt-submit", input.value);
                        }
                    }
                    if(actionType === "cancel") {
                        ipc.send("prompt-cancel");
                    }
                }
            })
        }
    } else if(args.type === "alert") {
        title.innerHTML = `
            <svg icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
                <path fill="#f76969" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div title-text>${args.title}</div>
        `;
        content.innerHTML = `
            <div alert-container>
                <div message>${args.value}</div>
            </div>
            <div button-container>
                <button prompt-button action="alert[ok]">
                    ${args.alertOkContent}
                </button>
            </div>
        `;
        const alertButtons = document.querySelectorAll("[prompt-button]");
        for (let i = 0; i < alertButtons.length; i++) {
            const alertButton = alertButtons[i];
            alertButton.addEventListener("click", () => {
                if(alertButton.getAttribute("action")) {
                    let action = alertButton.getAttribute("action");
                    let actionType = action.split("[")[1].split("]")[0];
                    if(actionType === "ok") {
                        ipc.send("alert-ok");
                    }
                }
            })
        }
    }
})