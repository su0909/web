import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './index.css';
import Test from './components/Test.js';
import Testson from './components/Testson.js';
import Test1 from './components/Test1.js';
import Mobx from './components/Mobx';
import TabBox from './components/TabBox';
import CommodityTypeList from './components/CommodityTypeList';
import CommodityListDetails from './components/CommodityListDetails';
import { BrowserRouter, Switch, Route } from "react-router-dom";

  ReactDOM.render(
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Test} exact />
          <Route path="/testson" component={Testson}  />
          {/* <Route path='/mobx' component={Mobx} />
          <Route path='/tabBox' component={TabBox} />
          <Route path='/commodityTypeList' component={CommodityTypeList} />
          <Route path='/commodityListDetails' component={CommodityListDetails} /> */}
          {/* <Route path="/" component={Test1} exact /> */}
        </Switch>
      </BrowserRouter>,
  document.getElementById('root')
);
