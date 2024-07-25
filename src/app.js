import './styles/style.css';
import './script/components/index.js';
import NotesApi from './script/data/remote/notes-api.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const noteForm = document.querySelector('note-form');
    const notesGrid = document.getElementById('notesGrid');
    const appHeader = document.querySelector('app-header');

    console.log('noteForm:', noteForm);
    console.log('notesGrid:', notesGrid);
    console.log('appHeader:', appHeader);

    if (noteForm && notesGrid && appHeader) {
        setupEventListeners(noteForm, notesGrid, appHeader);
        loadNotes();
    } else {
        console.error('One or more required elements are missing from the DOM');
    }
});

function setupEventListeners(noteForm, notesGrid, appHeader) {
    noteForm.addEventListener('note-added', (e) => {
        console.log('Note added event received:', e.detail);
        const { title, body } = e.detail;
        NotesApi.createNote(title, body)
            .then(newNote => {
                console.log('New note created:', newNote);
                addNoteToGrid(newNote);
            })
            .catch(error => console.error('Error creating note:', error));
    });

    notesGrid.addEventListener('note-deleted', (e) => {
        console.log('Note deleted event received:', e.detail);
        handleDelete(e.detail);
    });

    appHeader.addEventListener('search', (e) => {
        console.log('Search event received:', e.detail);
        handleSearch(e.detail);
    });
}

function loadNotes() {
    console.log('Loading notes...');
    document.getElementById('notesGrid').innerHTML = ''; // Clear existing notes
    NotesApi.getNotes()
        .then(notes => {
            console.log('Notes received from API:', notes);
            if (Array.isArray(notes)) {
                notes.forEach(note => addNoteToGrid(note));
            } else {
                console.error('Received notes is not an array:', notes);
            }
        })
        .catch(error => console.error('Error loading notes:', error));
}

function addNoteToGrid(note) {
    console.log('Adding note to grid:', note);
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('id', note.id);
    noteCard.setAttribute('title', note.title);
    noteCard.setAttribute('body', note.body);
    noteCard.setAttribute('created-at', note.createdAt);
    document.getElementById('notesGrid').appendChild(noteCard);
}

function handleSearch(query) {
    query = query.toLowerCase();
    const notes = document.querySelectorAll('note-card');
    notes.forEach(note => {
        const title = note.getAttribute('title').toLowerCase();
        const body = note.getAttribute('body').toLowerCase();
        if (title.includes(query) || body.includes(query)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
}

function handleDelete(noteId) {
    console.log('Deleting note:', noteId);
    NotesApi.deleteNote(noteId)
        .then(() => {
            console.log('Note deleted successfully');
            // Remove from the DOM
            const noteElement = document.getElementById(noteId);
            if (noteElement) {
                noteElement.remove();
            }
        })
        .catch(error => console.error('Error deleting note:', error));
}