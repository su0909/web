import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './index.css';
import Test from './components/Test.js';
import Testson from './components/Testson.js';

import { BrowserRouter, Switch, Route } from "react-router-dom";

  ReactDOM.render(
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Test} exact />
          <Route path="/testson" component={Testson}  />
        
        </Switch>
      </BrowserRouter>,
  document.getElementById('root')
);
