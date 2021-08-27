import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Note from './Note';

describe('<Note />', () => {
  let component;
  const mockHandler = jest.fn();
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
    date: new Date().toString(),
    user: '6119d8795f9d484718ad9a0d',
  };

  beforeEach(() => {
    component = render(<Note note={note} toggleImportance={mockHandler} />);
  });

  test('renders content', () => {
    expect(component.container).toHaveTextContent(
      'Component testing is done with react-testing-library'
    );
  });

  test('clicking the button calls event handler once', () => {
    const button = component.container.querySelector('button');
    fireEvent.click(button);

    expect(mockHandler.mock.calls.length).toBe(1);
  });
});
