import React from 'react';
import PropTypes from 'prop-types';

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important';

  return (
    <li className="note">
      {note.content}
      <button type="button" onClick={toggleImportance}>
        {label}
      </button>
    </li>
  );
};

Note.propTypes = {
  note: PropTypes.shape({
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    important: PropTypes.bool.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    ]).isRequired,
  }).isRequired,
  toggleImportance: PropTypes.func.isRequired,
};

export default Note;
