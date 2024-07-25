class AppHeader extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._style = document.createElement('style');
        this._updateStyle();
    }

    _updateStyle() {
        this._style.textContent = `
            :host {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--primary-color);
                color: #3498db;
            }
            div {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 2px;
            }
            h1 {
                margin: 0;
                font-family: "Montserrat", sans-serif;
                font-weight: bold;
            }
            input {
                width: 50%;
                padding: 10px;
                border: 1.5px solid #3498db;
            }
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
            }

            @media (max-width: 480px) {
                input {
                    width: 30%;
                }

                button {
                    padding: 5px;
                }
            }
        `;
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = '';
    }

    connectedCallback() {
        this.render();
        this._shadowRoot.querySelector('#newNote').addEventListener('click', () => {
            document.querySelector('note-form').style.display = 'block';
            document.querySelector('.app-container').classList.add('blurred');
        });
        this._shadowRoot.querySelector('input').addEventListener('input', (e) => {
            this._handleSearch(e.target.value);
        });
    }

    _handleSearch(query) {
        const event = new CustomEvent('search', { detail: query });
        this.dispatchEvent(event);
    }

    render() {
        this._emptyContent();
        this._shadowRoot.appendChild(this._style);
        const container = document.createElement('div');
        container.innerHTML = `
        <div>
            <h1>Notes</h1>
            <input type="text" placeholder="Search...">
            <button id="newNote">+ New Notes</button>
        </div>
        `;
        this._shadowRoot.appendChild(container);
    }
}

customElements.define('app-header', AppHeader);
