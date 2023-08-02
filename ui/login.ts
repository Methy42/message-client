import Header from "./components/Header";

class LoginPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <app-header hide-minimize hide-maximize hide-close title="Login"></app-header>
        `;
    }
}

customElements.define("login-page", LoginPage);
customElements.define("app-header", Header);

document.body.innerHTML = `<login-page></login-page>`;