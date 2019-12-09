import React, { Component } from 'react';
import { Modal, message, Icon, Select, Input, Button, Table, } from 'antd';
const { Option } = Select
import $axios from 'axios';
import '../css/CommodityListDetails.css';

import {CommodityListDetailsStore} from '../other/Store';

class CommodityListDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // mts:[],
      add_visible: false,
      add_model: {
        name: ''
      },
      search_from: {
        name: ""
      },
      table1: {
        typeid: "",
        type_name: '',
        columns: [{
          title: '序号',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        }],
        dataSource: [],
        sel_ids: []
      },
      options: [],
      table2: {
        typeid: "",
        type_name: '',
        columns: [{
          title: '序号',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        }],
        dataSource: [],
        sel_ids: []
      }
    };
    this.addModelChange = this.addModelChange.bind(this)
    this.searchValue = this.searchValue.bind(this)
  }


  //赋值
  searchValue(e) {
    let o = this.state.search_from
    o[e.target.name] = e.target.value
    this.setState({
      search_from: o
    })
  };
  addModelChange(e) {
    let o = this.state.add_model
    o[e.target.name] = e.target.value
    this.setState({
      add_model: o
    })
  };

  //查询所有类别
  getCommodityTypeList() {
    let _this = this
    $axios.get("http://localhost/type/getCommodityTypeList").then((res) => {
      console.log("getCommodityTypeList", res)
      let list = res.data.data
      let options = []
      for (let i = 0, len = list.length; i < len; i++) {
        options.push(<Option value={list[i].id} key={i}>{list[i].name}</Option>)
      }
      console.log("options", options)
      _this.setState({
        options: options
      }, () => {
        console.log("options", _this.state)
      })
    })
  };

  //左传输
  leftTransfer() {
    let _this = this
    
    console.log("leftTransfer", this.state)
    if(this.state.table2.typeid==""){
      message.warning('请先选择商品种类');
      return false
    }
    if(!this.state.table2.sel_ids.length){
      message.warning('请先选择商品');
      return false
    }
    let mts = []
    for(let i = 0,len = this.state.table2.sel_ids.length;i<len;i++){
      mts.push({ id: this.state.table2.sel_ids[i], typeid: this.state.table1.typeid})
    }
    $axios.get("http://localhost/details/editCommodityListDetails", {
      params: {
        mts: mts
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        _this.getTable1()
        _this.getTable2()
        _this.setState({
          table1: Object.assign({}, this.state.table1, { sel_ids:[]}),
          table2: Object.assign({}, this.state.table2, { sel_ids:[]})
        })
      }
    })
   
  };
  //右传输
  rightTransfer() {
    let _this = this
    console.log("rightTransfer", this.state)
    if(!this.state.table1.sel_ids.length){
      message.warning('请先选择商品');
      return false
    }
    if(this.state.table2.typeid==""){
      message.warning('请先选择商品种类');
      return false
    }
    let mts = []
    for(let i = 0,len = this.state.table1.sel_ids.length;i<len;i++){
      mts.push({ id: this.state.table1.sel_ids[i], typeid: this.state.table2.typeid})
    }
    $axios.get("http://localhost/details/editCommodityListDetails", {
      params: {
        mts: mts
      }
    }).then((res) => {
      
      console.log("res", res)
      if (res.status == 200) {
        _this.getTable1()
        _this.getTable2()
        _this.setState({
          table1: Object.assign({}, this.state.table1, { sel_ids:[]}),
          table2: Object.assign({}, this.state.table2, { sel_ids:[]})
        })
      }
    })
  };

  //查询第一个表格
  getTable1() {
    let _this = this
    $axios.get("http://localhost/details/getCommodityListDetails", {
      params: {
        typeid: this.state.table1.typeid,
        name: this.state.search_from.name
      }
    }).then((res) => {
      console.log("getTable1", res)
      _this.setState({
        table1: Object.assign({}, this.state.table1, { type_name: res.data.data.type_name, dataSource: res.data.data.list })
      })
    })
  };
  //查询第二个表格
  getTable2() {
    let _this = this
    $axios.get("http://localhost/details/getCommodityListDetails", {
      params: {
        typeid: this.state.table2.typeid
      }
    }).then((res) => {
      console.log("getTable2", res)
      _this.setState({
        table2: Object.assign({}, this.state.table2, { type_name: res.data.data.type_name, dataSource: res.data.data.list })
      })
    })
  };
  //新增
  addOk() {
    let _this = this
    console.log(_this.state.add_model)
    $axios.get("http://localhost/details/addCommodity", {
      params: {
        name: _this.state.add_model.name,
        typeid: _this.state.table1.typeid
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        _this.setState({
          add_model: {
            name: ''
          },
          add_visible: false
        })
        message.success('新增成功');
        _this.getTable1()
      } else {
        message.success('新增失败');
      }
    })
  };
 
  componentDidMount() {
    // const id = this.props.locations.match.params

    let _this = this
    _this.getCommodityTypeList()
    this.setState({
      table1: Object.assign({}, this.state.table1, { typeid: CommodityListDetailsStore.id.get() })
    }, () => {
      console.log(this.state.table1)
      _this.getTable1()
    })
  };
  render() {
    let _this = this
    const details_data = {
      handleChange: function (value) {
        console.log(`selected ${value}`);
        _this.setState({
          table2: Object.assign({}, _this.state.table2, { typeid: value })
        }, () => {
          _this.getTable2()
        })
      },
      table1: {
        rowSelection: {
          type: "checkbox",
          selectedRowKeys:_this.state.table1.sel_ids,
          onChange: function (selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            // this.setState({ selectedRowKeys });
            _this.setState({
              table1: Object.assign({}, _this.state.table1, { sel_ids: selectedRowKeys })
            })
          },
        }
      },
      table2: {
        rowSelection: {
          type: "checkbox",
          selectedRowKeys:_this.state.table2.sel_ids,
          onChange: function (selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            _this.setState({
              table2: Object.assign({}, _this.state.table2, { sel_ids: selectedRowKeys })
            })
          },
        }
      }
    };
    return (
      <div className="CommodityListDetails">
        <Modal
          title="新增"
          visible={this.state.add_visible}
          onOk={this.addOk.bind(this)}
          onCancel={() => { this.setState({ add_visible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <p> <Input name="name" value={this.state.add_model.name} placeholder="请输入商品名称" onChange={this.addModelChange} /></p>

        </Modal>
        <h3>商品详情页</h3>
        <div className="CommodityListDetails-box">
          <div className="form-box">
            <div className="form-li">
              <span className="from-text">商品名称:</span>
              <Input name="name" value={this.state.search_from.name} className="mg-rg-10"  placeholder="请输入商品名称" onChange={this.searchValue} />
              <Button className="mg-rg-10" onClick={this.getTable1.bind(this)}>查询</Button>
              <Button onClick={() => { this.setState({ add_visible: true })}}>新增</Button>
            </div>
            <div className="form-li">
              <span className="from-text">选择分类:</span>
              <Select style={{ width: 160 }} placeholder="请选择商品类别" onChange={details_data.handleChange} >
                {this.state.options}
              </Select>
            </div>
          </div>
          <div className="table-list">
            <div className="table-box">
              <p>商品种类: {this.state.table1.type_name}</p>
              <Table rowKey={record => record.id} rowSelection={details_data.table1.rowSelection} style={{ height: '500px' }} scroll={{ y: 400 }} dataSource={this.state.table1.dataSource} columns={this.state.table1.columns} pagination={false} />
            </div>
            <div className="btns">
              <Button  onClick={this.leftTransfer.bind(this)} ><Icon type="left"/></Button>
              <Button className="mg-top-10" onClick={this.rightTransfer.bind(this)}><Icon type="right" /></Button>
            </div>
            <div className="table-box">
              <p>选择分类: <span style={{ color: '#999' }}>{this.state.table2.type_name ? this.state.table2.type_name : '此处商品类别实时显示上方选择的分类'}</span></p>
              <Table rowKey={record => record.id} rowSelection={details_data.table2.rowSelection} style={{ height: '500px' }} scroll={{ y: 400 }} dataSource={this.state.table2.dataSource} columns={this.state.table2.columns} pagination={false} />
            </div>
          </div>
          <div className="sumbit-btn">
            {/* <Button className="mg-rg-10">保存</Button> */}
            {/* <Button onClick={()=>{this.props.history.push(`/commodityTypeList`)}}>确定</Button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default CommodityListDetails;
