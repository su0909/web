
const express = require('express');
const app = express();

const commodityTypeList = require("./commodityTypeList");
const commodityListDetails = require("./commodityListDetails");
//设置跨域请求
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
app.listen(80, function () {
    console.log('服务启动')
})
app.use("/type", commodityTypeList);
app.use("/details", commodityListDetails);


