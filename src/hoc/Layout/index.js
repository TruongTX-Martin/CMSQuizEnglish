import React, { Component } from 'react';
import Aux from '../Aux';
import Toolbar from '../../components/Toobar';
import './index.css';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Aux>
        <Toolbar />
        <div className="Main" >{this.props.children}</div>
      </Aux>
    );
  }
}
