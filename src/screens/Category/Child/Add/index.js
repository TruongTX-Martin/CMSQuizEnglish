import React, { Component } from 'react';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import firebase from 'firebase';


export default class index extends Component {


  constructor(props) {
    super(props);
    this.state = {
      title: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input Child Category'
        },
        value: ''
      },
      categoryName: ''
    };
    this.database = firebase.database();
    this.addChildCategory = this.addChildCategory.bind(this);
  }

  componentDidMount() {
    this.database.ref('category').child(this.props.match.params.categoryId)
    .on('value', snapshot => {
      if(snapshot.val()) {
        this.setState({ categoryName: snapshot.val().title})
      }
    })
  }

  addChildCategory() {
    if(this.state.title.value.length === 0) return; 
    this.database.ref('childCategory').push().update({
      categoryId: this.props.match.params.categoryId,
      title: this.state.title.value
    })
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <p>{this.state.categoryName}</p>
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
        <Button onClicked={this.addChildCategory}>Add </Button>
      </div>
    );
  }
}
