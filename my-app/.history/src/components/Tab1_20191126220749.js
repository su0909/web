import React, { Component } from 'react';
import { Modal, message, Icon, Select, Input, Button, Table, } from 'antd'; 

import {autorun,computed} from "mobx";

import {Tab1Store} from '../other/Store';



class Tab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val:Tab1Store.val.get()
    }
  }
  // 组件渲染后调用
  componentDidMount() {

    autorun(()=>{
      this.setState({
        val:Tab1Store.val.get()
      })
    })


  }
  render() {
    //指定指向
    let {val,computed1} = this.state
    let _this = this;
    
    return (
      <div className="Tab1">
         <p>autorun  tab1 =>{val}</p>
      </div>
    );
  }
}

export default Tab1;
