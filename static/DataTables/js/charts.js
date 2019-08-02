// function get_chart_data(data){
//    
// }
// document.write("<script type='text/javascript' src='http://echarts.baidu.com/gallery/vendors/echarts/echarts.min.js'></script>");
// document.write("<script type='text/javascript' src='http://echarts.baidu.com/gallery/vendors/echarts-gl/echarts-gl.min.js'></script>");


String.prototype.format = function(args) {
         var result = this;
         if (arguments.length > 0) {
             if (arguments.length == 1 && typeof (args) == "object") {
                 for (var key in args) {
                     if(args[key]!=undefined){
                         var reg = new RegExp("({" + key + "})", "g");
                         result = result.replace(reg, args[key]);
                     }
                 }
             }
             else {
                 for (var i = 0; i < arguments.length; i++) {
                     if (arguments[i] != undefined) {
                         var reg= new RegExp("({)" + i + "(})", "g");
                         result = result.replace(reg, arguments[i]);
                     }
                 }
             }
         }
         return result;
     }


function ChartGenerate(result){
    data = result.data;
    name = result.name;
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    myChart.showLoading();
    myChart.hideLoading();

    var base = -data.reduce(function (min, val) {
        return Math.floor(Math.min(min, val.l));
    }, Infinity);
    console.log(data);
    myChart.setOption(option = {
        title: {
            text: name+'价格图表',
            subtext: '最新年份：{0}    最新价格：{1}'.format(data[data.length-1].date, data[data.length-1].value),
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            // formatter: function (params) {
            //     return params[2].name + '<br />' + params[2].value;
            // }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(function (item) {
                return item.date;
            }),
            axisLabel: {
                formatter: function (value, idx) {
                    var date = new Date(value);
                    return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },
            splitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: {
            // axisLabel: {
            //     formatter: function (val) {
            //         return (val - base) * 100 + '%';
            //     }
            // },
            // axisPointer: {
            //     label: {
            //         formatter: function (params) {
            //             return ((params.value - base) * 100).toFixed(1) + '%';
            //         }
            //     }
            // },
            type: "value",
            splitNumber: 3,
            splitArea: {show: true},
            splitLine: {
                show: true
            }
        },
        series: [{
            name: '价格',
            type: 'line',
            data: data.map(function (item) {
                return item.value;
            }),
            // lineStyle: {
            //     normal: {
            //         opacity: 0
            //     }
            // },
            // hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: '#c23531'
                }
            },
            // showSymbol: false,
            stack: 'confidence-band',
            // symbol: 'none'
        },
        // {
        //     name: 'U',
        //     type: 'line',
        //     data: data.map(function (item) {
        //         return item.u - item.l;
        //     }),
        //     lineStyle: {
        //         normal: {
        //             opacity: 0
        //         }
        //     },
        //     areaStyle: {
        //         normal: {
        //             color: '#ccc'
        //         }
        //     },
        //     stack: 'confidence-band',
        //     symbol: 'none'
        // }, {
        //     type: 'line',
        //     data: data.map(function (item) {
        //         return item.value + base;
        //     }),
        //     hoverAnimation: false,
        //     symbolSize: 6,
        //     itemStyle: {
        //         normal: {
        //             color: '#c23531'
        //         }
        //     },
        //     showSymbol: false
        // }
        ]
    });
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
