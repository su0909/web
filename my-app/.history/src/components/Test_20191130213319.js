import React, { Component } from 'react';
import { message, Modal, Form, Input, Button, Table } from 'antd';
import '../css/CommodityTypeList.css';
import $axios from 'axios';
import { CommodityListDetailsStore } from '../other/Store';
import Testson from './Testson'
//console.log("Button", Button)
class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            page: 1,//页码
            rows: 4,//每页显示数量
            total: 0,//数据总数量

            add_visible: false,//新增的modal不可见
            edit_visible: false,//修改的modal不可见
            isSearct: false,//是否开启搜索
            commodity_visible: false,


            add_model: {//新增的时候拿来存提交的参数，临时存储用，axios提交给后端之后就清零哦
                name: '',
                describe: ''
            },
            edit_model: {//编辑的时候拿来存提交的参数，临时存储用，axios提交给后端之后就清零哦
                id: '',
                name: '',
                describe: ''
            },

            form: {//查询的时候拿来存提交的参数，临时存储用，axios提交给后端之后就清零哦
                id: '',
                name: ''
            },

            select_ids: []//多选的时候用哦，选中的id就给他

        };

    }


    //赋值
    editModelChange = (e) => {
        //修改的时候调用的
        let o = this.state.edit_model
        o[e.target.name] = e.target.value
        this.setState({
            edit_model: o
        })
    };
    addModelChange = (e) => {
        //增加的时候调用的
        let o = this.state.add_model
        o[e.target.name] = e.target.value
        this.setState({
            add_model: o
        })
    };
    changeValue = (e) => {
        //查询的时候调用的
        let o = this.state.form
        o[e.target.name] = e.target.value
        this.setState({
            form: o
        })
    };
    //查询
    getCommodityTypeList = () => {
        $axios.get("http://localhost/type/getCommodityTypeList", {//这个是后台拼接出来的端口，调用这个端口得到值
            params: {//params 参数
                page: this.state.page,
                rows: this.state.rows,
                id: this.state.isSearct ? this.state.form.id : "",//isSearct是true提交信息点击查询的时候，把提交的信息给后端
                name: this.state.isSearct ? this.state.form.name : ""
            }
        }).then((res) => {
            console.log('res', res)
            this.setState({
                data: res.data.data,
                total: res.data.total
            })
        })
    };


    // 组件渲染后调用 就一打开页面几句调用查询方法



    //查询 
    queryFun = () => {
        console.log(this.state)
        this.setState(
            { isSearct: true, }
            , () => {
                this.getCommodityTypeList()//异步问题哦。这个方法写在setstate里面，为了确保赋值结束再执行查询方发调用
            })
    };
    //重置
    resetFun = () => {
        this.setState({
            form: {
                id: '',
                name: '',
                isSearct: false
            }
        }, () => {
            this.getCommodityTypeList()
        })
    };

    //新增
    addOk = () => {
        if(!this.state.add_model.name||this.state.add_model.name===""){
            message.warning('请输入商品名称');
            return false;
        }
        if(!this.state.add_model.describe||this.state.add_model.describe===""){
            message.warning('请输入商品描述');
            return false;
        }
        $axios.get("http://localhost/type/addCommodityType", {
            params: {
                name: this.state.add_model.name,
                describe: this.state.add_model.describe
            }
        }).then((res) => {
            console.log("res", res)
            if (res.status == 200) {
                this.setState({
                    add_model: {//把add_model清零哦。
                        name: '',
                        describe: ''
                    },
                    add_visible: false
                })
                message.success('新增成功');
                this.getCommodityTypeList()//新增完了重新查询嗷
            } else {
                message.warning('新增失败');
            }

        })
    };
    //修改
    editOk = () => {
        console.log("editOk")
        if(!this.state.edit_model.name||this.state.edit_model.name===""){
            message.warning('请输入商品名称');
            return false;
        }
        if(!this.state.edit_model.describe||this.state.edit_model.describe===""){
            message.warning('请输入商品描述');
            return false;
        }
        $axios.get("http://localhost/type/editCommodityType", {
            params: {
                id: this.state.edit_model.id,
                name: this.state.edit_model.name,
                describe: this.state.edit_model.describe
            }
        }).then((res) => {
            console.log("res", res)
            if (res.status == 200) {
                this.setState({
                    edit_model: {
                        id: '',
                        name: '',
                        describe: ''
                    },
                    edit_visible: false
                })
                message.success('修改成功');
                this.getCommodityTypeList()
            } else {
                message.warning('修改失败');
            }
        })
    };
    //删除
    delOk = (ids) => {
        if (ids.length == 0) {
            message.warning('请选择删除对象');
            return false
        }
        $axios.get("http://localhost/type/delCommodityType", {
            params: {
                ids: ids
            }
        }).then((res) => {
            console.log("res", res)
            if (res.status == 200) {
                message.success('删除成功');
                this.getCommodityTypeList()
            } else {
                message.warning('删除失败');
            }
        })

    };
    // 组件渲染后调用
    componentDidMount() {
        console.log("componentWillMount")
        this.getCommodityTypeList()
    };

    render() {
        const _this = this;
        const { data, rows, total } = this.state;
        console.log("props", this.props);
        const columns = [
            {
                title: "商品种类编码",
                dataIndex: 'id'
            }, {
                title: '商品种类名称',
                dataIndex: 'name'
            }, {
                title: '描述',
                dataIndex: "describe"
            }, {
                title: '操作', render: (record) =>
                    <p className="operation-box">
                        <a href="#" onClick={() => { CommodityListDetailsStore.id.set(record.id); this.setState({ commodity_visible: true }) }}>详情</a>
                        {/* <a href="#" onClick={() => { this.props.history.push(`/commodityListDetails/${record.id}`) }}>详情</a> */}
                        {/* record是ANTD封装的参数，可以直接获取点击这一行时的数据
                        this.props.history.push({ pathname: '/dashboard/groupper', state: { datagroupsperson } });pathname：写跳转界面的路径
                        state：要传过去的数据...页面取值：this.props.location.state.datagroupsperson  */}
                        <a href="#" style={{ "marginLeft": "10px" }} onClick={() => { this.delOk([record.id]) }}>删除</a>
                        <a href="#" style={{ "marginLeft": "10px" }} onClick={() => { this.setState({ edit_model: { id: record.id, name: record.name, describe: record.describe }, edit_visible: true }) }}>编辑</a>
                    </p>
            }];//this.props.history.push(`/commodityListDetails/${record.id}`)跳转路由
        //render=>record 当前行的数据

        //分页
        const pagination = {
            total: total, //总数,数据总共有多少条
            showSizeChanger: true,//是否可以修改每页显示数量
            pageSize: rows,//每页显示数量
            //参数current	当前页数   pageSize	每页条数
            onShowSizeChange: function (current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
                _this.setState({
                    page: current,
                    rows: pageSize
                }, () => {
                    _this.getCommodityTypeList()
                });
                //执行state赋值和调用后端查询

            },
            onChange: function (current) {
                console.log('Current: ', current);
                _this.setState({
                    page: current
                }, () => {
                    _this.getCommodityTypeList()
                });
            },//分页的回调
            showTotal(total) {
                return `显示1-${rows}共${total} 条`;
            }//分页的文本 total当前页显示的条数
        };

        const rowSelection = {
            type: "checkbox",
            onChange: function (ids, selectedRows) {
                //原本函数：onChange:Function(selectedRowKeys, selectedRows) selectedRowKeys代码最后一行设置成了record.id，就是点击选中的那个id,
                //selectedRows是点击选中的那一行的全部数据
                console.log("ids", ids)
                console.log("selectedRows", selectedRows)
                _this.setState({
                    select_ids: ids
                })
            }//选中修改后的回调
        };



        return (
            <div className="CommodityTypeList">
                <Modal
                    title="商品详情页"
                    visible={this.state.commodity_visible}
                    onOk={() => { this.setState({ commodity_visible: false }) }}//}//onOk	点击确定回调	function(e)
                    onCancel={() => { this.setState({ commodity_visible: false }) }}
                    okText="确认"
                    cancelText="取消"
                    width="1300px"
                >
                    <Testson></Testson>
                </Modal>
                <Modal
                    title="修改"//视窗第一行是标题，如果在两个model中间添加<p>文字就会在视窗中间显示
                    visible={this.state.edit_visible}//弹出的这个视窗可不可见
                    onOk={this.editOk}//点击确定时触发的事件
                    onCancel={() => { this.setState({ edit_visible: false }) }}//点击取消时触发的事件
                    okText="确认" //确认按钮的文本
                    cancelText="取消" //确认按钮的文本
                >
                    <p><Input name="name" value={this.state.edit_model.name} placeholder="请输入种类名称" onChange={this.editModelChange}	//输入框内容变化时的回调
                    ></Input></p>
                    <p><Input name="describe" value={this.state.edit_model.describe} placeholder="请输入种类描述" onChange={this.editModelChange}></Input></p>

                </Modal>
                <Modal
                    title="新增"
                    visible={this.state.add_visible}
                    onOk={this.addOk}
                    onCancel={() => this.setState({ add_visible: false })}
                >
                    <p><Input name="name" value={this.state.add_model.name} placeholder="请输入种类名称" onChange={this.addModelChange}></Input></p>
                    <p><Input name="describe" value={this.state.add_model.describe} placeholder="请输入种类描述" onChange={this.addModelChange}></Input></p>

                </Modal>


                <div className='CommodityTypeList-box'>
                    <div className='form-box'>
                        <div className='form-li'>
                            <span className="form-text">商品种类编码</span>
                            <Input name="id" value={this.state.form.id} onChange={this.changeValue}></Input>
                        </div>
                        <div className='form-li'>
                            <span className="form-text">商品种类名称</span>
                            <Input name="name" value={this.state.form.name} onChange={this.changeValue}></Input>
                        </div>
                        <div className='form-li'>
                            <Button onClick={this.queryFun}>查询</Button>
                            <Button style={{ "marginLeft": "10px" }} onClick={this.resetFun}>重置</Button>
                        </div>

                    </div>
                    <div className="table-box">
                        <div className="button-box">
                            <Button className="" onClick={() => { this.setState({ add_visible: true }) }}>新建</Button>
                            <Button style={{ "marginLeft": "10px" }} onClick={() => { this.delOk(this.state.select_ids) }}>删除</Button>
                            {/* <Button>保存</Button> */}
                        </div>
                    </div>
                    <div className="table">
                        {/*rowKey 指定key 为 id  
                                rowSelection 选择
                                pagination 分页
                                dataSource={data}，提交要渲染到页面的数据，用ui组件封装的方法遍历显示数据哦，我们只用提交就好了
                            */}
                        <Table rowKey={record => record.id} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                    </div>
                </div>
            </div>

        );
    }
}
export default Test;