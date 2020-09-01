var fs       = require("fs");

fs.readFile("./config.txt", "utf-8", function(error, config) {
    if (error) {
        console.log(error);
        console.log("config文件读入出错");
    }
    var configItem = config.toString().split("\n");
    var resultArrayContainer = configItem.filter(function (s) {
        return s && s.trim();
     });
     let Container = [];
     for(let i = 0; i < resultArrayContainer.length; i ++) {
        var resultArray = resultArrayContainer[i].toString().split(" ")
        resultArray.splice(0, 14) // 截取前14项无用数据 从第10项保留
        resultArray.splice(1, 1)  // 排除第11项
        resultArray.splice(6, 16) // 排除第17-32项　　
        resultArray.splice(8, 19) // 排除剩余数据
        resultArray.forEach((item, index)=>{
            if(index === 0 && item !== 0) {resultArray[index] = item/3600};
            if(index === 1 && item !== 0) {resultArray[index] = item/1000};
            if(index === 2 && item !== 0) {resultArray[index] = item/3600};
            if(index === 3 && item !== 0) {resultArray[index] = item/1000};
            if(index === 4 && item !== 0) {resultArray[index] = item/46};
            if(index === 5 && item !== 0) {resultArray[index] = item/1000};
        })
        if(i === 3000) {
            console.log('处理完毕第一条数据', resultArray)
        }
        Container.push(resultArray)
     }
     exports.write(Container);

});

// export the excel
var excelPort = require('excel-export');

exports.write = function(req, res) {
    var conf  = {};
    conf.name = "mysheet";
    conf.cols = [
        {caption: '编码器反馈速度', type: 'number', width: 80},
        {caption: '反馈的转弯速度', type: 'number', width: 80},
        {caption: '底盘收到的命令线速度', type: 'number', width: 80},
        {caption: '底盘收到的命令转弯速度', type: 'number', width: 80},
        {caption: '底盘pid目标线速度', type: 'number', width: 80},
        {caption: '底盘pid目标拐弯速度', type: 'number', width: 80},
        {caption: '左轮ticks', type: 'string', width: 80},
        {caption: '右轮ticks', type: 'string', width: 80},
    ];
    conf.rows    = req;
    var result   = excelPort.execute(conf);
    var filePath = "./result.xlsx";
    fs.writeFile(filePath, result, 'binary', function(err) {
        if (err) {
            console.log(err);
        }
        console.log("success!");
    });

};
