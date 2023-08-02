import { ipcRenderer } from "electron";

interface IHeaderAttributes extends NamedNodeMap {
    "hide-minimize": Attr;
    "hide-maximize": Attr;
    "hide-close": Attr
    "title": Attr;
}

class ActionButton extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "closed" });
        this.shadowStyle = document.createElement("style");
        this.shadowButton = document.createElement("button");

        this.shadowStyle.textContent = `
        button {
            background-color: #fff;
            border: 1px solid #d5d9d9;
            border-radius: 8px;
            box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
            box-sizing: border-box;
            color: #0f1111;
            cursor: pointer;
            display: inline-block;
            font-family: "Amazon Ember",sans-serif;
            font-size: 13px;
            line-height: 29px;
            padding: 0 10px 0 11px;
            position: relative;
            text-align: center;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            vertical-align: middle;
          }
          
          button:hover {
            background-color: #f7fafa;
          }
          
          button:focus {
            border-color: #008296;
            box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
            outline: 0;
          }
        `;

        this.shadow.appendChild(this.shadowStyle);
        this.shadow.appendChild(this.shadowButton);
    }

    shadow: ShadowRoot;
    shadowStyle: HTMLStyleElement;
    shadowButton: HTMLButtonElement;

    connectedCallback() {
        this.shadowButton.textContent = this.textContent;
    }
}

export default class Header extends HTMLElement {
    constructor() {
        super();

        customElements.define("action-button", ActionButton);

        this.minimizeButton = new ActionButton();
        this.maximizeButton = new ActionButton();
        this.closeButton = new ActionButton();

        this.minimizeButton.textContent = "-";
        this.minimizeButton.shadowButton.addEventListener("click", () => ipcRenderer.send("minimize-window"));

        this.maximizeButton.textContent = "+";
        this.maximizeButton.addEventListener("click", () => ipcRenderer.send("maximize-window"));

        this.closeButton.textContent = "x";
        this.closeButton.addEventListener("click", () => ipcRenderer.send("close-window"));

        this.innerHTML = `
        <div class="header">
            <div class="header__title"></div>
            <div class="header__buttons">
            </div>
        </div>
        `;

        this.querySelector(".header__buttons")?.appendChild(this.minimizeButton);
        this.querySelector(".header__buttons")?.appendChild(this.maximizeButton);
        this.querySelector(".header__buttons")?.appendChild(this.closeButton);
    }

    attributes!: IHeaderAttributes;
    minimizeButton: ActionButton;
    maximizeButton: ActionButton;
    closeButton: ActionButton;

    connectedCallback() {
        if (this.attributes["title"].value) {
            this.querySelector(".header__title")!.textContent = this.attributes["title"].value;
        }

        if (this.attributes["hide-minimize"].value) {
            this.minimizeButton.style.display = "none";
        }

        if (this.attributes["hide-maximize"].value) {
            this.maximizeButton.style.display = "none";
        }

        if (this.attributes["hide-close"].value) {
            this.closeButton.style.display = "none";
        }
    }

    static get observedAttributes() {
        return ["hide-minimize", "hide-maximize", "hide-close", "title"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "hide-minimize") {
            if (newValue === "true") {
                this.minimizeButton.style.display = "none";
            } else {
                this.minimizeButton.style.display = "inline-block";
            }
        } else if (name === "hide-maximize") {
            if (newValue === "true") {
                this.maximizeButton.style.display = "none";
            } else {
                this.maximizeButton.style.display = "inline-block";
            }
        } else if (name === "hide-close") {
            if (newValue === "true") {
                this.closeButton.style.display = "none";
            } else {
                this.closeButton.style.display = "inline-block";
            }
        } else if (name === "title") {
            this.querySelector(".header__title")!.textContent = newValue;
        }
    }
}