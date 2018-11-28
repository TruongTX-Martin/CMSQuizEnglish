import React from 'react';
import './index.css';

const button = props => (
  <div className="ParrentButton">
    <button
      onClick={props.onClicked}
      className={['Button', props.btnStyle].join(' ')}
    >
      {props.children}
    </button>
  </div>
);

export default button;
