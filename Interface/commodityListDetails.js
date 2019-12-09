const express = require('express');
const router = express.Router();
const fs = require('fs');//用来读文件的


//查询商品 商品表{"id":"5","typeid":"4","name":"薯片"} 
//渲染页面的时候，第一页给了一个种类表的id(种类表的Id是商品表的typeid),所以得到的是typeid
//点击查询的时候会提交name商品名称

//查询商品
router.get('/getCommodityListDetails',function(req,res){
    //读取文件
    let type_name = "";//类别名称
    let ef_data = [];//有效数组

    const typeid = req.query.typeid//前端提交的typeid也就是种类id 是第一页提交的那个种类id
    const name = req.query.name//前端查询框提交的name,要查询的商品名，若商品名为空，会显示同种类Id下全部数据

    //读取商品数据
    let Promise1 = new Promise((resolve, reject)=>{
        fs.readFile('./commodityListDetails.json',function(err,data){
            if(err){
                console.error(err);
            }
            //读出得数据要转成json
            let person = data.toString();
            person = JSON.parse(person);
            let arr = person.data;//arr是数据库里面的数据
           
            for(let i = 0,len =arr.length;i<len;i++){
                console.log("name",name?arr[i].name.indexOf(name)>=0:true)//a?1:2,判断a是否存在，如果存在则为真，则给name赋值为
				//name?arr[i].name.indexof(name)>=0:true)意思是:
                //name存在则模糊查询，arr[i].name.indexof(name)>=0模糊查询找到了，name就是true，找不到name就是false ;name不存在则赋值为true
                //(arr[i].typeid==typeid&&(name?arr[i].name.indexof(name)>=0:true)
                //满足typeid在数据中存在，且 name为真（情况1：数据模糊查询找到了前端提交的name；情况2：前端没有提交name，刚刚进入本页面就是情况2）
                //满足以上情况再给ef_data加入（typeid和name）同时满足条件的这条数据a[i]，
                //若前端没有提交name，则永远为真，则会遍历取出所有typeid满足条件的数据
                if(arr[i].typeid==typeid&&(name?arr[i].name.indexOf(name)>=0:true)){
                    ef_data.push(arr[i])
                }
              
            }
            console.log("ef_data",ef_data)
            resolve()
        })
    })
	 //读取商品类别名称
 //种类表 {"id":"1574325816337","name":"饮料","describe":"饮料"}
 //右侧下拉选择的时候会提交一个id(种类Id哦)
//这里只写了左边表调用查询方法的情况的注释table1，右边表提交typeid调用查询方法也是这个一样的哦table2

    let Promise2 = new Promise((resolve, reject)=>{
        fs.readFile('./commodityTypeList.json',function(err,data){
            if(err){
                console.error(err);
            }
            //读出得数据要转成json
            let person = data.toString();
            person = JSON.parse(person);
            let arr = person.data;
            for(let i = 0,len =arr.length;i<len;i++){
                console.log("arr",arr[i])
                if(arr[i].id==typeid){////前端提交的typeid也就是种类id 是第一页提交的那个种类id
                    type_name = arr[i].name
					//type_name 存起来所有是第一页选中的种类下的数据的name
                }
            }
            console.log("type_name",type_name)
            resolve()
        })
    })
    Promise.all([Promise1,Promise2]).then(()=>{
        console.log("ef_data",ef_data)
        console.log("type_name",type_name)
        //返回到前端
        res.json({
            data:{
                list:ef_data,//所有满足第一页提交的种类id的数据
                type_name:type_name//所有满足第二页右边选择框提交的种类id的数据
            },
            total:ef_data.length,
            msg:"查询成功"
        })
    })
    
})
//新增
router.get('/addCommodity',function(req,res){
    fs.readFile('./commodityListDetails.json',function(err,data){
        if(err){
            return console.error(err);
        }
        var person = data.toString();//将二进制的数据转换为字符串
        person = JSON.parse(person);//将字符串转换为json对象

        person.data.unshift({"id":`${new Date().getTime()}`,"typeid":req.query.typeid,"name":req.query.name});//将传来的对象push进数组对象中
        person.total = person.data.length;//定义一下总条数，为以后的分页打基础
        var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile('./commodityListDetails.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
        res.json({ msg:"新增成功"})
    })
})

//批量转换编号
router.get('/editCommodityListDetails',function(req,res){
    let mts = req.query.mts//用mts存的是前端给的所有选中的ids
    //只需要知道选中的数据id,和要变成的typeid这两个数据就好了，不管左移右移都是这一个原理哦

    fs.readFile('./commodityListDetails.json',function(err,data){
        if(err){
            console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        //把数据读出来,然后进行修改
        console.log("mts",mts)
        for(var i =0;i<mts.length;i++){
            mts[i] = JSON.parse(mts[i])
            console.log("mts",mts[i])
             for(var j = 0; j < person.data.length;j++){
                 console.log(person.data[j].id,mts[i].id)
                if(mts[i].id == person.data[j].id){//选中数据中和提交的商品id相同的id
                    console.log('id一样的');
                    if(person.data[j]){
                        person.data[j].typeid = mts[i].typeid;
                    }
                }
            }
        }
        
        person.total = person.data.length;//每次更新了数据都要更新一下total
        var str = JSON.stringify(person);
        fs.writeFile('./commodityListDetails.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('--------------------修改成功');
            console.log(person.data);
        })
        res.json({msg:"修改成功"})
    })

})

module.exports = router;