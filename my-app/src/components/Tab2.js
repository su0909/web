import React, { Component } from 'react';
import { Modal, message, Icon, Select, Input, Button, Table, } from 'antd'; 

import {autorun} from "mobx";
import {Tab2Store} from '../other/Store';

class Tab2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      val:Tab2Store.val.get()
    }
  }
  // 组件渲染后调用
  componentDidMount() {
    autorun(()=>{
      this.setState({
        val:Tab2Store.val.get()
      })
    })
  }
  render() {
    //指定指向
    let {val} = this.state
    let _this = this;
    
    return (
      <div className="Tab2">
          <p>tab2 =>{Tab2Store.val.get()}</p>
      </div>
    );
  }
}

export default Tab2;
