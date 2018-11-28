import React from 'react';
import ReactLoading from 'react-loading';
import './index.css';

const loading = props => {
  return (
    <div className="divLoading">
      <ReactLoading
        type={props.type ? props.type : 'spin'}
        color={props.color ? props.color : 'black'}
        height={50}
        width={50}
      />
    </div>
  );
};

export default loading;
