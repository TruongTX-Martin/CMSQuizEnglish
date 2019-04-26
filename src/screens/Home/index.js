import React, { Component } from 'react';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { NavLink } from 'react-router-dom';
import firebase from 'firebase';
import './index.css';
import '../../styles/style.css';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory: [],
      loading: true
    };
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent;
    this.fetchCategory();
  }
  
  onBackButtonEvent(event) {
    this.fetchCategory();
  }

  fetchCategory = () => {
    this.setState({ loading: true });
    const ref = firebase.database().ref('category');
    ref.on('value', snapshot => {
      if (snapshot.val() != null) {
        let arr = [];
        for (let key in snapshot.val()) {
          arr.push({
            id: key,
            ...snapshot.val()[key]
          });
          this.setState({ listCategory: arr });
        }
      }
      this.setState({ loading: false });
    });
  };

  renderCategory(category) {
    return (
      <div key={category.id} className="CategoryItem">
        <NavLink to={`/category/child/list/${category.id}`}>
          <p className="CategoryTitle">{category.title}</p>
        </NavLink>
        <p className="CategoryDescription">{category.description}</p>
      </div>
    );
  }

  onAddNew = () => {
    // this.props.history.push('/category/add');
  };

  render() {
    return (
      <div>
        <div className="Top">
          <div className="DivTitle">
            <h2> List Category </h2>
          </div>
          <div className="DivButton">
            <Button onClicked={this.onAddNew}>Add New</Button>
          </div>
        </div>
        {
          this.state.loading && <Loading/>
        }
        {this.state.listCategory.map(category => this.renderCategory(category))}
      </div>
    );
  }
}
