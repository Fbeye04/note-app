class NoteCard extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._style = document.createElement('style');
        this._updateStyle();
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    _updateStyle() {
        this._style.textContent = `
            :host {
                display: block;
                border: 1px solid #ddd;
                padding: 10px;
                margin: 10px;
                border: 1.5px solid #3498db;
                border-radius: 5px;
                background-color: #fff;
                box-sizing: border-box;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
            h2 {
                margin-top: 0;
                font-family: "Montserrat", sans-serif;
                white-space: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
            p {
                font-family: "Open Sans", sans-serif;
                white-space: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
            small {
                display: block;
                margin-top: 10px;
                color: #999;
                font-size: 0.8em;
            }
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                margin-top: 10px;
            }
            @media (max-width: 480px) {
                :host {
                    padding: 8px;
                    margin: 8px;
                }
                h2, p {
                    white-space: normal; /* Ensures text wraps to the next line */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-word;
                }
                small {
                    font-size: 0.8em;
                }
                button {
                    padding: 4px 8px;
                    font-size: 0.9em;
                }
            }
        `;
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = '';
    }

    render() {
        this._emptyContent();
        this._shadowRoot.appendChild(this._style);
        const container = document.createElement('div');
        const createdAt = new Date(this.getAttribute('created-at'));
        const year = createdAt.getFullYear();
        const month = ('0' + (createdAt.getMonth() + 1)).slice(-2); // Month is zero-based
        const day = ('0' + createdAt.getDate()).slice(-2);
        const time = createdAt.toTimeString().slice(0, 5); // Format HH:MM

        container.innerHTML = `
            <div>
                <h2>${this.getAttribute('title')}</h2>
                <p>${this.getAttribute('body')}</p>
                <small>${year}-${month}-${day} ${time}</small>
                <button class="delete-button">Delete</button>
            </div>
        `;
        this._shadowRoot.appendChild(container);
    }

    addEventListeners() {
        this._shadowRoot.querySelector('.delete-button').addEventListener('click', () => {
            this._handleDelete();
        });
    }

    _handleDelete() {
        const event = new CustomEvent('note-deleted', { detail: this.getAttribute('id'), bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
}

customElements.define('note-card', NoteCard);
