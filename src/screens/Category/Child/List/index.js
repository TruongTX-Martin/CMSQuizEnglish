import React, { Component } from 'react';
import firebase from 'firebase';
import Button from '../../../../components/Button';
import Loading from '../../../../components/Loading';
import { NavLink } from 'react-router-dom';
import Helper from '../../../../helper';
import '../../../../styles/style.css';
import './index.css';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      categoryName: '',
      childCategorys: []
    };
    this.database = firebase.database();
  }

  onAddNew = () => {
    this.props.history.push(
      `/category/child/add/${this.props.match.params.categoryId}`
    );
  };

  componentDidMount() {
    this.getCategoryName();
    this.getCategoryListChild();
  }

  getCategoryName() {
    this.database
      .ref('category')
      .child(this.props.match.params.categoryId)
      .on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({ categoryName: snapshot.val().title });
        }
      });
  }

  getCategoryListChild() {
    this.setState({ loading: true });
    this.database
      .ref('childCategory')
      .orderByChild('categoryId')
      .equalTo(this.props.match.params.categoryId)
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
          this.setState({ childCategorys: arr });
        }else{
          this.setState({ childCategorys: [] });
        }
      });
  }

  onDeleteCategory(category) {
    Helper.showAlert(
      'Confirm Delete!',
      'Are you sure want to delete ?',
      value => {
        if (value) {
          this.deleteNote('childCategory', category.id);
          this.database
            .ref('item')
            .orderByChild('childCategoryId')
            .equalTo(category.id)
            .on('value', snapshot => {
              if (snapshot.val()) {
                for (let key in snapshot.val()) {
                  this.deleteNote('item', key);
                }
              }
            });
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

  renderChildCategory(category) {
    return (
      <div key={category.id} className="Item">
        <div className="LeftItem">
          <NavLink to={`/category/item/list/${category.id}`}>
            <p className="CategoryTitle">{category.title}</p>
          </NavLink>
        </div>
        <div className="RightItem">
          <Button
            btnStyle="Delete"
            onClicked={() => this.onDeleteCategory(category)}
          >
            Delete
          </Button>
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
            <Button onClicked={this.onAddNew}>Add New</Button>
          </div>
        </div>
        {this.state.loading && <Loading />}
        {this.state.childCategorys.map(cate => this.renderChildCategory(cate))}
      </div>
    );
  }
}
