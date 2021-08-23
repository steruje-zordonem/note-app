import React, { useState, useImperativeHandle } from 'react';
import './Togglable.css';
import PropTypes from 'prop-types';

const Togglable = React.forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);

  const hideWhenVisible = { display: visibility ? 'none' : '' };
  const showWhenVisible = { display: visibility ? '' : 'none' };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  useImperativeHandle(ref, () => ({ toggleVisibility }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button
          type="button"
          className="togglabble-btn"
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Togglable;
