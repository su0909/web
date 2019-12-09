import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import './App.css';
import Test from './components/Test.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Route path="/" component={Test} exact />
      </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
