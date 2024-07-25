class NoteForm extends HTMLElement {
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
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 20px;
                border: 1.5px solid #3498db;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                z-index: 1000;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-sizing: border-box;
            }
            input, textarea {
                width: 100%;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 3px;
                font-family: 'Open Sans', sans-serif;
                box-sizing: border-box;
                padding: 8px;
            }
            hr {
                border: none;
                border-top: 1px solid #3498db;
                margin: 10px 0;
            }
            textarea {
                height: 150px;
                resize: vertical;
            }
            .form-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }
            .form-footer button {
                border-radius: 3px;
                cursor: pointer;
                font-family: 'Open Sans', sans-serif;
                border: none;
                background-color: #3498db;
                color: white;
                padding: 8px 12px;
                font-weight: bold;
                flex: 1;
            }
            .form-footer button:hover {
                background-color: #2c7cb8;
            }
            .error {
                color: red;
                font-size: 0.8em;
                margin-top: -5px;
                margin-bottom: 10px;
                font-family: 'Open Sans', sans-serif;
            }
            @media (max-width: 480px) {
                :host {
                    padding: 15px;
                }
                .form-footer {
                    flex-direction: column;
                }
                .form-footer button {
                    width: 100%;
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
        container.innerHTML = `
            <form id="noteForm">
                <input type="text" id="title" placeholder="Title" required>
                <div class="error" id="titleError"></div>
                <hr/>
                <textarea id="body" placeholder="Note content" required></textarea>
                <div class="error" id="bodyError"></div>
                <div class="form-footer">
                    <button type="button" id="closeForm">Close</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        `;
        this._shadowRoot.appendChild(container);
    }

    addEventListeners() {
        const form = this._shadowRoot.getElementById('noteForm');
        const titleInput = this._shadowRoot.getElementById('title');
        const bodyInput = this._shadowRoot.getElementById('body');
        const closeButton = this._shadowRoot.getElementById('closeForm');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                const newNote = {
                    id: 'note-' + Date.now(),
                    title: titleInput.value,
                    body: bodyInput.value,
                    createdAt: new Date().toISOString(),
                    archived: false
                };
                this.dispatchEvent(new CustomEvent('note-added', { detail: newNote }));
                this.closeForm();
            }
        });

        closeButton.addEventListener('click', () => {
            this.closeForm();
        });

        // Real-time validation
        titleInput.addEventListener('input', () => this.validateField(titleInput, 'titleError', 'Title is required'));
        bodyInput.addEventListener('input', () => this.validateField(bodyInput, 'bodyError', 'Content is required'));
    }

    closeForm() {
        this.style.display = 'none';
        document.querySelector('.app-container').classList.remove('blurred');
        this.resetForm();
    }

    resetForm() {
        const form = this._shadowRoot.getElementById('noteForm');
        form.reset();
        // Clear any error messages
        this._shadowRoot.getElementById('titleError').textContent = '';
        this._shadowRoot.getElementById('bodyError').textContent = '';
    }

    validateForm() {
        const titleValid = this.validateField(this._shadowRoot.getElementById('title'), 'titleError', 'Title is required');
        const bodyValid = this.validateField(this._shadowRoot.getElementById('body'), 'bodyError', 'Content is required');
        return titleValid && bodyValid;
    }

    validateField(field, errorId, errorMessage) {
        const errorElement = this._shadowRoot.getElementById(errorId);
        if (field.value.trim() === '') {
            errorElement.textContent = errorMessage;
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }
}

customElements.define('note-form', NoteForm);