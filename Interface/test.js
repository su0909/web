//node npm install jquery --save

//es6
// let {a,b} = {a:1,b:2}
//findIndex() //获取满足条件的索引


//indexOf() 返回索引
//slice(1,2) 索引截取
//unshift() 数组开头添加
//push() 结尾添加
//splice(a,b)//数组的删除 a:索引  b:删除的数量

//JSON.stringify() json 转化成字符串
//JSON.parse() 字符串转化成json
const express = require('express');
const app = express();
const fs = require('fs');


//设置跨域请求
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

let num = "123"
console.log("我的年龄${num}")
console.log( `我的${num}`)


  //Promise
Promise.all([new Promise((resolve, reject)=>{
    setTimeout(function(){
        console.log("2000")
        resolve()
    },2000)
}),new Promise((resolve, reject)=>{
    setTimeout(function(){
        console.log("1000")
        resolve()
    },1000)
})]).then(()=>{
    console.log("异步操作执行完执行")
})
//Promise

app.listen(90, function () {
    console.log('服务启动')
})


app.get("/test",function(req,res){
    console.log("req",req.query.page)
  
    // fs.readFile('./test.json',function(err,data){
    //     let da = JSON.parse(data.toString())
    //     console.log("da",da.data)
    //     res.json({
    //         data:da,
    //         msg:"查询成功"
    //     })
    // })
})