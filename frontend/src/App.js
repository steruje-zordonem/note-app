import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Note from './components/Note';
import Notification from './components/Notification';
import noteService from './services/notes';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';
import Footer from './components/Footer';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      noteService.setToken(loggedUser.token);
    }
  }, []);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const addNote = (newNote) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(newNote)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const toggleImportanceOf = (id) => {
    const noteToUpdate = notes.find((note) => note.id === id);
    const updatedNote = { ...noteToUpdate, important: !noteToUpdate.important };

    noteService
      .update(id, updatedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `the note '${noteToUpdate.content}' was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const logIntoApp = async (credentials) => {
    const { username, password } = credentials;

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogoutBtn = () => {
    window.localStorage.removeItem('loggedNoteAppUser');
    setUser(null);
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm logIntoApp={logIntoApp} />
    </Togglable>
  );

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p className="logged-user-info">{user.name} logged-in</p>
          <button type="button" onClick={handleLogoutBtn}>
            logout
          </button>
          {noteForm()}
        </div>
      )}
      <button
        className="toggle-importance-button"
        onClick={() => setShowAll(!showAll)}
      >
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
