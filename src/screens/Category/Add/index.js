import React, { Component } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Axios from '../../../axios';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input your title'
        },
        value: ''
      },
      description: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input your description'
        },
        value: ''
      }
    };
  }

  addCategory = () => {
    if (
      this.state.title.value.trim().length === 0 ||
      this.state.description.value.trim().length === 0
    )
      return;
    const category = {
      title: this.state.title.value.trim(),
      description: this.state.description.value.trim()
    };
    Axios.post('/category.json', category)
      .then(res => {
        alert('Success');
      })
      .catch(err => {
        alert('Failed');
      });
  };

  render() {
    return (
      <div>
        <p>Add Category</p>
        <Input
          elementType={this.state.title.elementType}
          elementConfig={this.state.title.elementConfig}
          value={this.state.title.value}
          changed={event =>
            this.setState({
              title: {
                ...this.state.title,
                value: event.target.value
              }
            })
          }
        />
        <Input
          elementType={this.state.description.elementType}
          elementConfig={this.state.description.elementConfig}
          value={this.state.description.value}
          changed={event =>
            this.setState({
              description: {
                ...this.state.title,
                value: event.target.value
              }
            })
          }
        />
        <Button onClicked={this.addCategory}>Add Category</Button>
      </div>
    );
  }
}
