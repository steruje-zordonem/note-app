import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import NoteForm from './NoteForm';

test('<NoteForm /> updates parent state and calls onSubmit', () => {
  // stworzyć component
  const createNote = jest.fn();
  const component = render(<NoteForm createNote={createNote} />);
  // muszę wpisać form input
  const input = component.container.querySelector('input');
  const form = component.container.querySelector('form');
  // clicknąć submit
  fireEvent.change(input, {
    target: { value: 'testing of forms could be easier' },
  });
  fireEvent.submit(form);
  // i zobaczyć czy mock function zostanie callnięta
  expect(createNote.mock.calls.length).toBe(1);
  expect(createNote.mock.calls[0][0].content).toBe(
    'testing of forms could be easier'
  );
});
