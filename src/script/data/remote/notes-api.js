const BASE_URL = 'https://notes-api.dicoding.dev/v2'; // Replace with your actual API URL

class NotesApi {
  static createNote(title, body) {
    return fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to create note`));
        }
      })
      .then((responseJson) => {
        if (responseJson.status === 'success') {
          return Promise.resolve(responseJson.data);
        } else {
          return Promise.reject(new Error(responseJson.message || 'Failed to create note'));
        }
      });
  }

  static getNotes() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to retrieve notes`));
        }
      })
      .then((responseJson) => {
        if (responseJson.status === 'success') {
          return Promise.resolve(responseJson.data);
        } else {
          return Promise.reject(new Error(responseJson.message || 'Failed to retrieve notes'));
        }
      });
  }

  static deleteNote(id) {
    // URL: /notes/{note_id}
    return fetch(`${BASE_URL}/notes/${id}`, {
      // Method: DELETE
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to delete note`));
        }
      })
      .then((responseJson) => {
        // Response handling
        if (responseJson.status === 'success') {
          // If successful, resolve with the message
          return Promise.resolve(responseJson.message);
        } else {
          return Promise.reject(new Error(responseJson.message || 'Failed to delete note'));
        }
      });
  }
}

export default NotesApi;