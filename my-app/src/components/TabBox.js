import React, { Component } from 'react';
import { Modal, message, Icon, Select, Input, Button, Table, } from 'antd'; 
import '../css/TabBox.css';

import {autorun} from "mobx";

import {Tab1Store,Tab2Store} from '../other/Store';

import Tab1 from './Tab1'
import Tab2 from './Tab2'



class TabBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tab1_val:Tab1Store.val.get(),
        tab2_val:Tab2Store.val.get()
    }
  }
  // 组件渲染后调用
  componentDidMount() {
    console.log("componentDidMount")
    autorun(()=>{
        this.setState({
            tab1_val : Tab1Store.val.get(),
            tab2_val : Tab2Store.val.get()
        })
    })
  }
  render() {
    //指定指向
    let _this = this;
    let {tab1_val,tab2_val} = this.state

    return (
      <div className="TabBox">
          <div className="btn-box">
                <Button onClick={()=>{Tab1Store.val.set(Math.ceil(Math.random()*100))}}>tab1:{tab1_val}</Button> 
                <Button onClick={()=>{Tab2Store.val.set(Math.ceil(Math.random()*100))}}>tab2:{tab2_val}</Button>
          </div>
          <section>
              <div className="sec-box">
                    <Tab1></Tab1>
              </div>
              <div className="sec-box">
                    <Tab2></Tab2>
              </div>
          </section>
      </div>
    );
  }
}

export default TabBox;
