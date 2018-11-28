import React, { Component } from 'react';
import firebase from 'firebase';
import Button from '../../../../components/Button';
import Loading from '../../../../components/Loading';
import { Link } from 'react-router-dom';
import Helper from '../../../../helper';
import '../../../../styles/style.css';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      childItem: [],
      loading: false
    };
    this.database = firebase.database();
    this.onAddNewItem = this.onAddNewItem.bind(this);
  }

  componentDidMount() {
    this.getCategoryName();
    this.getChildItem();
  }

  getCategoryName() {
    this.database
      .ref('childCategory')
      .child(this.props.match.params.childId)
      .on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({ categoryName: snapshot.val().title });
        }
      });
  }

  getChildItem() {
    this.setState({ loading: true });
    this.database
      .ref('item')
      .orderByChild('childCategoryId')
      .equalTo(this.props.match.params.childId)
      .on('value', snapshot => {
        this.setState({ loading: false });
        if (snapshot.val()) {
          let arr = [];
          for (let key in snapshot.val()) {
            arr.push({
              id: key,
              ...snapshot.val()[key]
            });
          }
          this.setState({ childItem: arr });
        }else{
          this.setState({ childItem: []});
        }
      });
  }

  onAddNewItem() {
    this.props.history.push(
      `/category/item/add/${this.props.match.params.childId}`
    );
  }

  onDeleteItem(item) {
    Helper.showAlert(
      'Confirm Delete!',
      'Are you sure want to delete ?',
      value => {
        if (value) {
          this.deleteNote('item', item.id);
          this.getChildItem()
        }
      }
    );
  }
  deleteNote(ref, child) {
    this.database
      .ref(ref)
      .child(child)
      .remove();
  }

  renderChildItem(item) {
    return (
      <div key={item.id} className="Item">
        <div className="LeftItem">
          <Link
            to={{
              pathname: `/category/item/add/${item.id}`,
              query: {
                type: 'update',
                childId: this.props.match.params.childId
              }
            }}
          >
            <p className="CategoryTitle">{item.title}</p>
          </Link>
        </div>
        <div className="RightItem">
          <Button btnStyle="Delete" 
          onClicked={() => this.onDeleteItem(item)}
          >Delete</Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="Top">
          <div className="DivTitle">
            <h2>{this.state.categoryName}</h2>
          </div>
          <div className="DivButton">
            <Button onClicked={this.onAddNewItem}>Add New</Button>
          </div>
        </div>
        {this.state.loading && <Loading />}
        {this.state.childItem.map(item => this.renderChildItem(item))}
      </div>
    );
  }
}
