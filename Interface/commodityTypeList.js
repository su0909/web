
const express = require('express');
const router = express.Router();
const fs = require('fs');

//查询商品种类
router.get('/getCommodityTypeList',function(req,res){
    //读取文件
    fs.readFile('./commodityTypeList.json',function(err,data){
        var person = data.toString();
        person = JSON.parse(person);
        //？
        if(!req.query.page){
            //返回到前端
            res.json({
                data:person.data,
                total:person.data.length,
                msg:"查询成功"
            })
            return false
        }
        //?
        const page = parseInt(req.query.page)//现在是第几页
        const rows = parseInt(req.query.rows)//一页显示多少个数据
        const id = req.query.id
        const name = req.query.name
        
        if(err){
            console.error(err);
        }
        //读出得数据要转成json
       

        let arr = person.data;
        let ef_data = [];//有效数组
        for(let i = 0,len =arr.length;i<len;i++){
            console.log("arr",arr[i])
            if(arr[i].id.indexOf(id)>=0&&arr[i].name.indexOf(name)>=0){
                //模糊查找哦。循环遍历arr，arr是json那个数据，当arr[i]数组里面的某一个数据里面存在提交的id/name，则push
                ef_data.push(arr[i])
            }
        }
        //返回到前端
        res.json({
            data:ef_data.slice(rows*(page-1),(page)*rows),//切割出每页显示的数据(切割选中的数组下标开始，结束，2到3就只有2哦，结束的不算)
            total:ef_data.length,
            msg:"查询成功"
        })
    })
})

//新增
router.get('/addCommodityType',function(req,res){
    fs.readFile('./commodityTypeList.json',function(err,data){
        if(err){
            return console.error(err);
        }
        var person = data.toString();//将二进制的数据转换为字符串
        person = JSON.parse(person);//将字符串转换为json对象

        person.data.unshift({"id":`${new Date().getTime()}`,"name":req.query.name,"describe":req.query.describe});//将传来的对象push进数组对象中
        person.total = person.data.length;//定义一下总条数，为以后的分页打基础
        var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile('./commodityTypeList.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
        res.json({ msg:"新增成功"})
    })
})

//修改
router.get('/editCommodityType',function(req,res){
    fs.readFile('./commodityTypeList.json',function(err,data){
        if(err){
            console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        //把数据读出来,然后进行修改
        for(var i = 0; i < person.data.length;i++){
            if(req.query.id == person.data[i].id){
                console.log('id一样的');
                if(person.data[i]){
                    person.data[i].name = req.query.name;
                    person.data[i].describe = req.query.describe;
                }
            }
        }
        person.total = person.data.length;
        var str = JSON.stringify(person);
        fs.writeFile('./commodityTypeList.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('--------------------修改成功');
            console.log(person.data);
        })
        res.json({msg:"修改成功"})
    })
})

//删除
router.get('/delCommodityType',function(req,res){
    fs.readFile('./commodityTypeList.json',function(err,data){
        if(err){
            return console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        console.log("ids",req.query.ids)
        //把数据读出来删除
        for(let i = 0,len = req.query.ids.length;i<len;i++){
            person.data.splice(person.data.findIndex(item => item.id === req.query.ids[i]), 1)//findIndex这个是精确查找，找到第一个数据满足id=后端提交的id的值       //splice(a,b)//数组的删除 a:索引  b:删除的数量
        }
        person.total = person.data.length;
        var str = JSON.stringify(person);
        //然后再把数据写进去
        fs.writeFile('./commodityTypeList.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log("----------删除成功------------");
        })
        res.json({msg:"删除成功"})
    })
})

module.exports = router;