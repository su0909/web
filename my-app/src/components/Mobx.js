//1. npm install mobx --save
//2. npm install mobx-react --save
import React, { Component } from 'react';

// import { observer } from 'mobx-react';

/*
observable.box 添加观测一个数据
autorun 内部观测一个数据变化时执行
computed 计算属性
*/
import { observable,autorun,computed,action} from "mobx";




//box string number bool 
const mobx_data = {
    computed1:computed(()=>(1+1)),
    mobx1:observable.box(0),
    mobx2:observable({ key: "value"}),
    mobx3:observable([
        { title: "Spoil tea", completed: true },
        { title: "Make coffee", completed: false }
    ]),
    mobx4:[ { title: "Spoil tea", completed: true },
    { title: "Make coffee", completed: false }]
}
// //computed 计算属性
// console.log("computed",mobx_data.computed1.get())
// //mobx 
// //observable.box添加监听
// //观测到的数据发生变化的时候，如果变化的值处在autorun中，那么autorun就会自动执行。
// mobx_data.mobx1.observe((change)=>{
//     console.log(change.oldValue, "->", change.newValue)
// })
autorun(() => {
    console.log(mobx_data.mobx1.get());
    console.log(mobx_data.mobx2["key"]);
    console.log(mobx_data.mobx3[0].title);
    console.log(mobx_data.mobx4[0].title);
})
mobx_data.mobx1.set(1);
mobx_data.mobx1.set(2);
mobx_data.mobx2["key"] = "new value"
mobx_data.mobx3[0].title = "Spoil tea2"
mobx_data.mobx4[0].title = "Spoil tea2"
mobx_data.mobx1.set(1);
// autorun(() => {
//     console.log(mobx_data.mobx2["key"]);
//     console.log(mobx_data.mobx3[0].title);
// })
// mobx_data.mobx2["key"] = "new value"

// //mobx 1






class Mobx extends Component {

    constructor(props) {
        super(props);
        //全局变量
        this.state = {
        };
    }
    // 组件渲染后调用
    componentDidMount() {
        console.log("componentDidMount")
    }
    onReset(){
        // this.props.appState.resetTimer();
    };
    render() {
        
        //指定指向
        let _this = this;
        return (
            <div className="Mobx">
                Mobx
                {/* <div onClick={this.onReset.bind(this)}>  Seconds passed: {this.props.appState.timer}</div> */}
            </div>
        );
    }
}

export default Mobx;
