import React, { Component } from 'react';
import { message, Modal, Form, Input, Button, Table } from 'antd';
import $axios from 'axios';
import '../css/CommodityTypeList.css';
import CommodityListDetails from './CommodityListDetails'
import {CommodityListDetailsStore} from '../other/Store';

class CommodityTypeList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],//列表数据
      page: 1,//页码
      rows: 4,//每页显示数量
      total: 0,//总数量,
      isSearct: false,//是否开启搜索
      from: {
        id: "",
        name: ""
      },
      commodity_visible:false,
      add_visible: false,
      add_model: {
        name: '',
        describe: ''
      },
      edit_visible: false,
      edit_model: {
        id: '',
        name: '',
        describe: ''
      },
      select_ids:[]
    };
    this.changeValue = this.changeValue.bind(this)
    this.addModelChange = this.addModelChange.bind(this)
    this.editModelChange = this.editModelChange.bind(this)
  }
  // 在渲染前调用,在客户端也在服务端。
  //查询
  getCommodityTypeList() {
    let _this = this
    $axios.get("http://localhost/type/getCommodityTypeList", {
      params: {
        page: _this.state.page,
        rows: _this.state.rows,
        id: _this.state.isSearct ? _this.state.from.id : "",
        name: _this.state.isSearct ? _this.state.from.name : ""
      }
    }).then((res) => {
      console.log("res", res)
      _this.setState({
        data: res.data.data,
        total: res.data.total
      })
    })
  };

  //赋值
  changeValue(e) {
    let o = this.state.from
    o[e.target.name] = e.target.value
    this.setState({
      from: o
    })
  };
  addModelChange(e) {
    let o = this.state.add_model
    o[e.target.name] = e.target.value
    this.setState({
      add_model: o
    })
  };
  editModelChange(e) {
    let o = this.state.edit_model
    o[e.target.name] = e.target.value
    this.setState({
      edit_model: o
    })
  };
  //查询
  queryFun() {
    console.log(this.state)
    let _this = this
    _this.setState({
      isSearct: true,
    }, () => {
      _this.getCommodityTypeList()
    })
  };
  //重置
  resetFun() {
    console.log("resetFun", this.setState)
    let _this = this
    _this.setState({
      from: {
        id: '',
        name: '',
        isSearct: false
      }
    }, () => {
      _this.getCommodityTypeList()
    })
  };

  //新增
  addOk() {
    let _this = this
    console.log(_this.state.add_model)
    $axios.get("http://localhost/type/addCommodityType", {
      params: {
        name: _this.state.add_model.name,
        describe: _this.state.add_model.describe
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        _this.setState({
          add_model: {
            name: '',
            describe: ''
          },
          add_visible: false
        })
        message.success('新增成功');
        _this.getCommodityTypeList()
      } else {
        message.success('新增失败');
      }
    })
  };
  //修改
  editOk() {
    let _this = this
    console.log(_this.state.edit_model)
    $axios.get("http://localhost/type/editCommodityType", {
      params: {
        id: _this.state.edit_model.id,
        name: _this.state.edit_model.name,
        describe: _this.state.edit_model.describe
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        _this.setState({
          edit_model: {
            id: '',
            name: '',
            describe: ''
          },
          edit_visible: false
        })
        message.success('修改成功');
        _this.getCommodityTypeList()
      } else {
        message.success('修改失败');
      }
    })
  };
  //删除
  delOk(ids) {
    let _this = this
    console.log("ids",ids)
    $axios.get("http://localhost/type/delCommodityType", {
      params: {
        ids: ids
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        message.success('删除成功');
        _this.getCommodityTypeList()
      } else {
        message.success('删除失败');
      }
    })
  };
  componentDidMount() {
    console.log("componentWillMount")
    this.getCommodityTypeList()
  };
  render() {
    const { data, rows, total } = this.state;
    console.log(this.props);

    const _this = this //1
    const columns = [
      {
        title: '商品种类编码',
        dataIndex: 'id'
      }, {
        title: '商品种类名称',
        dataIndex: 'name'
      }, {
        title: '描述',
        dataIndex: 'describe'
      },
      {
        title: '操作', dataIndex: '', key: 'x', render: (record) =>
          <p className="operation-box">
            
            <a href="#" onClick={()=>{CommodityListDetailsStore.id.set(record.id)}}>详情</a>
            {/* <a href="#" onClick={()=>{CommodityListDetailsStore.id.set(record.id),this.props.history.push(`/commodityListDetails`)}}>详情</a> */}
            <a href="#" onClick={()=>{this.delOk([record.id])}}>删除</a>
            <a href="#" onClick={() => { this.setState({ edit_visible: true, edit_model: { id: record.id, name: record.name, describe: record.describe } }) }}>编辑</a>
          </p>
      }];

    //分页
    const pagination = {
      total: total,
      showSizeChanger: true,
      pageSize: rows,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
        _this.setState({
          page: current,
          rows: pageSize
        }, () => {
          _this.getCommodityTypeList()
        });
      },
      onChange(current) {
        console.log('Current: ', current);
        _this.setState({
          page: current
        }, () => {
          _this.getCommodityTypeList()
        });
      },
      showTotal(total) {
        return `显示1-${rows}共${total} 条`;
      }
    };

    const rowSelection = {
      type: "checkbox",
      onChange: function (ids,row) {
        console.log("row",row)
        _this.setState({
          select_ids:ids
        })
      }
    };



    return (
      
      <div className="CommodityTypeList">
          <Modal
          title="商品详情页"
          visible={this.state.commodity_visible}
          onOk={()=>{this.setState({commodity_visible:false})}}
          onCancel={() => { this.setState({commodity_visible:false})}}
          okText="确认"
          cancelText="取消"
          width = "1300px"
        >
         <CommodityListDetails></CommodityListDetails>
        </Modal>
        <Modal
          title="修改"
          visible={this.state.edit_visible}
          onOk={this.editOk.bind(this)}
          onCancel={() => { this.setState({ edit_visible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <p> <Input name="name" value={this.state.edit_model.name} placeholder="请输入种类名称" onChange={this.editModelChange} /></p>
          <p> <Input name="describe" value={this.state.edit_model.describe} placeholder="请输入种类描述" onChange={this.editModelChange} /></p>
        </Modal>
        <Modal
          title="新增"
          visible={this.state.add_visible}
          onOk={this.addOk.bind(this)}
          onCancel={() => { this.setState({ add_visible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <p> <Input name="name" value={this.state.add_model.name} placeholder="请输入种类名称" onChange={this.addModelChange} /></p>
          <p> <Input name="describe" value={this.state.add_model.describe} placeholder="请输入种类描述" onChange={this.addModelChange} /></p>
        </Modal>
        <div className="CommodityTypeList-box">
          <div className="form-box">
            <div className="form-li">
              <span className="from-text" >商品种类编码:</span>
              <Input name="id" value={this.state.from.id} onChange={this.changeValue} />
            </div>
            <div className="form-li">
              <span className="from-text">商品种类名称:</span>
              <Input name="name" value={this.state.from.name} onChange={this.changeValue} />
            </div>
            <div className="form-li">
              <Button className="mg-rg-10" onClick={this.queryFun.bind(this)}>查询</Button>
              <Button onClick={this.resetFun.bind(this)}>重置</Button>
            </div>
          </div>
          <div className="table-box">
            <div className="button-box">
              <Button className="mg-rg-10" onClick={() => {this.setState({ add_visible: true }) }}>新建</Button>
              <Button className="mg-rg-10" onClick={()=>{this.delOk(this.state.select_ids)}}>删除</Button>
              {/* <Button>保存</Button> */}
            </div>
            <div className="table">
              <Table rowKey={record => record.id} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommodityTypeList;
