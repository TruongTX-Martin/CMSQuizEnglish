import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './index.css';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('Props:', this.props);
    return (
      <div className="Toolbar">
        <h1 onClick={() => this.props.history.replace('/')}>Quiz English Listening</h1>
      </div>
    );
  }
}

export default withRouter(index);
