import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './hoc/Layout';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase';
import Home from './screens/Home';
import CategoryAdd from './screens/Category/Add';
import CategoryList from './screens/Category/Child/List';
import CategoryChildAdd from './screens/Category/Child/Add';
import ItemList from './screens/Category/Item/List';
import ItemAdd from './screens/Category/Item/Add';
class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp({
      apiKey: 'AIzaSyDsHU-qqFd_f_EmcKw0S4r69emcK92hdmw',
      authDomain: 'quizenglishlistening.firebaseapp.com',
      databaseURL: 'https://quizenglishlistening.firebaseio.com',
      projectId: 'quizenglishlistening',
      storageBucket: 'quizenglishlistening.appspot.com',
      messagingSenderId: '185141496389'
    });
  }

  render() {
    return (
      <BrowserRouter>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/category/add" component={CategoryAdd} />
              <Route
                exact
                path="/category/child/list/:categoryId"
                component={CategoryList}
              />
              <Route
                exact
                path="/category/child/add/:categoryId"
                component={CategoryChildAdd}
              />
              <Route
                exact
                path="/category/item/list/:childId"
                component={ItemList}
              />
              <Route
                exact
                path="/category/item/add/:childId"
                component={ItemAdd}
              />
            </Switch>
          </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
