import React, { Component } from 'react';
import { Modal, message, Icon, Select, Input, Button, Table, } from 'antd';
const { Option } = Select
import $axios from 'axios';
import { CommodityListDetailsStore } from '../other/Store';
import '../css/CommodityListDetails.css';
class Testson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_name: '',//查找的商品名
      add_visible: false,//新增的Modal默认不可见
      add_name: '',//新增的商品名
      options: [],//用来存右边下拉框的值

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
    }
  }
  //查询所有类别
  getCommodityTypeList = () => {
    $axios.get("http://localhost/type/getCommodityTypeList").then((res) => {
      console.log("getCommodityTypeList", res)//查询种类表的数据
      let list = res.data.data
      let options = []
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].id != this.state.table1.typeid) {
          options.push(<Option value={list[i].id} key={i}>{list[i].name}</Option>)//option里面存的是html，把所有类的id和名字存起来
        }

      }
      console.log("options", options)
      this.setState({
        options: options
      }, () => {
        console.log("options", this.state)
      })
    })
  };


  //左传输
  leftTransfer = () => {

    if (!this.state.table2.sel_ids.length) {
      message.warning('请先选择商品');//选中右边表里面要左移的商品
      return false
    }
    if (this.state.table2.typeid == "") {//右边表是表2，判断表二下拉框有没有选商品种类值
      message.warning('请先选择商品种类');
      return false
    }
    let mts = []

    for (let i = 0, len = this.state.table2.sel_ids.length; i < len; i++) {
      mts.push({ id: this.state.table2.sel_ids[i], typeid: this.state.table1.typeid })//把左边表选中的数据向右边表移动，所以mts存选中的ids和目标左表的typeid
    }
    $axios.get("http://localhost/details/editCommodityListDetails", {//后台批量转换Id那个函数
      params: {
        mts: mts
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        this.getTable1()
        this.getTable2()
        this.setState({
          table1: Object.assign({}, this.state.table1, { sel_ids: [] }),
          //Object.assign方法的第一个参数是目标对象，把后面的参数合并到第一个参数
          //注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。【根据这一点实现多选id清空】
          table2: Object.assign({}, this.state.table2, { sel_ids: [] })
        })
      }
    })

  };
  //右传输
  rightTransfer = () => {
    if (!this.state.table1.sel_ids.length) {
      message.warning('请先选择商品');//选中左边表里面要右移的商品
      return false
    }
    if (this.state.table2.typeid == "") {//右边表是表2，判断表二下拉框有没有选商品种类值
      message.warning('请先选择商品种类');
      return false
    }

    let mts = []
    for (let i = 0, len = this.state.table1.sel_ids.length; i < len; i++) {
      mts.push({ id: this.state.table1.sel_ids[i], typeid: this.state.table2.typeid })
      console.log("mts", mts)
    }
    $axios.get("http://localhost/details/editCommodityListDetails", {
      params: {
        mts: mts
      }
    }).then((res) => {

      console.log("res", res)
      if (res.status == 200) {
        this.getTable1()
        this.getTable2()
        this.setState({
          table1: Object.assign({}, this.state.table1, { sel_ids: [] }),
          table2: Object.assign({}, this.state.table2, { sel_ids: [] })
        })
      }
    })
  };
  //查询第一个表格
  getTable1 = () => {

    $axios.get("http://localhost/details/getCommodityListDetails", {
      params: {
        typeid: this.state.table1.typeid,
        name: this.state.search_name
      }
    }).then((res) => {
      console.log("getTable1", res)
      this.setState({
        table1: Object.assign({}, this.state.table1, { type_name: res.data.data.type_name, dataSource: res.data.data.list })
        //后端res存的 data:{list:ef_data,//所有满足第一页提交的种类id的数据  type_name:type_name//所有满足第二页右边选择框提交的种类id的数据}
      })
    })
  };


  //查询第二个表格
  getTable2 = () => {
    $axios.get("http://localhost/details/getCommodityListDetails", {
      params: {
        typeid: this.state.table2.typeid
      }
    }).then((res) => {
      console.log("getTable2", res)
      this.setState({
        table2: Object.assign({}, this.state.table2, { type_name: res.data.data.type_name, dataSource: res.data.data.list })
      })
    })
  };
  componentDidMount() {
    this.getCommodityTypeList()
    this.setState({
      table1: Object.assign({}, this.state.table1, { typeid: CommodityListDetailsStore.id.get() })
    }, () => {
      console.log(this.state.table1)
      this.getTable1()
    })
  };
  addOk = () => {
  
    if (!this.state.add_name||this.state.add_name == "") {
      message.warning('请输入新增内容');
      return false
    }
    $axios.get("http://localhost/details/addCommodity", {
      params: {
        name: this.state.add_name,
        typeid: this.state.table1.typeid
      }
    }).then((res) => {
      console.log("res", res)
      if (res.status == 200) {
        this.setState({
          add_name: '',
          add_visible: false
        })
        message.success('新增成功');
        this.getTable1()
      } else {
        message.warning('新增失败');
      }
    })
  };
  render() {
    let _this = this
    const details_data = {//对antd表格封装属性的操作
      handleChange: function (value) {//handleChange https://www.runoob.com/react/react-forms-events.html 这个value是下拉框选中的value
        console.log(`selected ${value}`);
        _this.setState({
          table2: Object.assign({}, _this.state.table2, { typeid: value })//value存进table2
        }, () => {
          _this.getTable2()//重新查表显示数据
        })
      },
      table1: {
        rowSelection: {
          type: "checkbox",
          selectedRowKeys: _this.state.table1.sel_ids,//双向绑定！我给selectedRowKeys赋哪个id值，页面上就显示哪个Id被勾选
          onChange: function (selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            // this.setState({ selectedRowKeys });
            //原本函数：onChange:Function(selectedRowKeys, selectedRows) selectedRowKey是选中的所有id
            _this.setState({//每次选中的ids改变的时候，把这些ids全部赋给选中的id
              table1: Object.assign({}, _this.state.table1, { sel_ids: selectedRowKeys })
            }, () => {
              console.log("state", _this.state)
            })

          },
        }
      },
      table2: {
        rowSelection: {
          type: "checkbox",
          selectedRowKeys: _this.state.table2.sel_ids,
          onChange: function (selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            _this.setState({
              table2: Object.assign({}, _this.state.table2, { sel_ids: selectedRowKeys })
            }, () => {
              console.log("state", _this.state)
            })

          },
        }
      }
    };


    return (
      <div className="CommodityListDetails">
        <Modal
          title="新增"
          visible={this.state.add_visible}//点击新增按钮弹出的modal
          onOk={this.addOk}//点击确定时触发的事件
          onCancel={() => { this.setState({ add_visible: false, add_name: "" }) }}//点击取消时触发的事件
          okText="确认"
          cancelText="取消"
        >
          <p><Input name="name" value={this.state.add_name} placeholder="请输入要新增的商品名" onChange={(e) => { this.setState({ add_name: e.target.value }) }}></Input></p>

        </Modal>


        <h3>商品详情页</h3>
        <div className="CommodityListDetails-box">
          <div className="form-box">
            <div className="form-li">
              <span className="from-text">商品名称:</span>
              <Input name="name" value={this.state.search_name} className="mg-rg-10" placeholder="请输入商品名称" onChange={(e) => { this.setState({ search_name: e.target.value }) }} />
              <Button className="mg-rg-10" onClick={this.getTable1}>查询</Button>
              <Button onClick={() => { this.setState({ add_visible: true }) }}>新增</Button>
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
              <Button onClick={this.leftTransfer} ><Icon type="left" /></Button>
              <Button className="mg-top-10" onClick={this.rightTransfer}><Icon type="right" /></Button>
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

export default Testson;

