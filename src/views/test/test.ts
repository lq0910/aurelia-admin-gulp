import { Router } from 'aurelia-router';
import { Utils } from '../../components/teamy/utils';
import * as echarts from '../../../node_modules/echarts/dist/echarts.min.js'
declare var layui: any

export class Test {
    router: Router;
    layer: any
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    list_all: Array<any> = []
    list_all1: Array<any> = [
        {
            nickname: "test",
            money: 100,
            btype: "管理费",
            bumen: "办公室",
            desc: "66"
        },
        {
            nickname: "test1",
            money: 99,
            btype: "差旅费",
            bumen: "市场部",
            desc: "66"
        },
        {
            nickname: "test2",
            money: 88,
            btype: "采购费",
            bumen: "生产部",
            desc: "66"
        },
        {
            nickname: "test3",
            money: 77,
            btype: "管理费",
            bumen: "技术部",
            desc: "66"
        },
        {
            nickname: "test4",
            money: 66,
            btype: "差旅费",
            bumen: "办公室",
            desc: "66"
        }
    ]
    static inject() { return [Router] };
    constructor(r: Router) {
        this.router = r;
    }

    activate() {
    }
    attached() {
        var that = this;
        layui.use(['form', 'layer'], function () {
            var form = layui.form;
            that.layer = layui.layer;
            //监听提交
            form.on('submit(formDemo)', function (data) {
                console.log('submit', data.field);
                that.addData(data.field)
                return false;
                // layer.msg(JSON.stringify(data.field));
            });
        });
        this.getData()

    }

    addData(data: any) {
        let s = localStorage
        let arr = JSON.parse(s.getItem('data-list'))
        if (arr) {
            arr.push(data)
        } else {
            arr = []
            arr.push(data)
        }

        console.log('addDate ok', arr);

        s.setItem('data-list', JSON.stringify(arr))

        this.layer.msg('提交成功')
        this.getData()
        return false;
    }

    getData() {
        let s = localStorage
        let d = JSON.parse(s.getItem('data-list'))
        if (d) {
            this.list_all = [...d]
            console.log('getData ok', this.list_all)
        } else {
            this.list_all = this.list_all1
        }
        this.chatData(this.list_all)
    }

    chatData(list: Array<any>) {
        let data = {
            bumens: [],
            nums: [],
            data: []
        }
        // list.forEach(el => {
        //     if (data.bumens.indexOf(el.bumen) == -1) {
        //         data.bumens.push(el.bumen)
        //     }
        //     // data.data.push(el.money)
        //     console.log('chatData...', data);
        // });

        var temp = {};
        var temp1 = {};
        for (var i in list) {
            // 按部门类别
            var key = list[i].bumen;
            if (temp[key]) {
                temp[key].name = temp[key].name;
                temp[key].value = Number(temp[key].value) + Number(list[i].money);

            } else {
                temp[key] = {};
                temp[key].name = list[i].bumen;
                temp[key].value = Number(list[i].money);

            }

            // 按费用类别
            var key1 = list[i].btype;
            if (temp1[key1]) {
                temp1[key1].name = temp1[key1].name;
                temp1[key1].value = Number(temp1[key1].value) + Number(list[i].money);

            } else {
                temp1[key1] = {};
                temp1[key1].name = list[i].btype;
                temp1[key1].value = Number(list[i].money);

            }
        }
        console.log(temp);
        for (var k in temp) {
            data.bumens.push(temp[k].name)
            data.nums.push(temp[k].value)
        }
        for (var k in temp1) {
            data.data.push(temp1[k])
        }
        console.log('chatData...', data);
        this.intChat(data)
        this.intChat1(data)
    }

    intChat(data: any) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '部门报销统计'
            },
            tooltip: {},
            legend: {
                data: ['费用']
            },
            xAxis: {
                data: data.bumens
            },
            yAxis: {},
            series: [{
                name: '费用',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9A22' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FFD56E' // 100% 处的颜色
                        }], false),
                        // barBorderRadius: [30, 30, 0, 0],
                    }
                },
                data: data.nums
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    intChat1(data: any) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main1'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '报销类别饼图',
                subtext: '各类别费用',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: data.bumens
            },
            series: [
                {
                    name: '报销费用',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data.data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }


    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
