class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._style = document.createElement('style');
        this._updateStyle();
    }

    connectedCallback() {
        this.render();
    }

    _updateStyle() {
        this._style.textContent = `
            :host {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    }

    render() {
        this._shadowRoot.innerHTML = '';
        this._shadowRoot.appendChild(this._style);
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        this._shadowRoot.appendChild(spinner);
    }

    show() {
        this.style.display = 'flex';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('loading-indicator', LoadingIndicator);