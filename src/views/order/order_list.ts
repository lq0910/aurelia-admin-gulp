import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { Order, OrderService } from '../../api/order';

declare var layui
export class Orderlist {
    router: TabRouter;
    orderservice: OrderService
    utils: Utils;
    layer: any // layer
    size: number = 10;
    current_page: number = 1;
    order: Order
    order_list: Array<any> = []
    static inject() { return [TabRouter, OrderService, Utils] };
    constructor(r: TabRouter, orderservice: OrderService, utils: Utils) {
        this.router = r;
        this.orderservice = orderservice;
        this.utils = utils
    }

    activate() {
        var that = this;
        layui.use('layer', function () {
            that.layer = layui.layer;
        })
    }
    attached() {
        this.order_list = null
        this.getList() // 获取订单列表
    }

    // 获取订单列表
    getList() {

        var loading = this.layer.load(2);
        const data = {
            page: this.current_page,
            size: this.size
        }
        this.orderservice.list(data).then(
            os => {
                if (os.ok) {
                    console.log("获取订单列表成功！", os);
                    this.order_list = os.payload.results
                    this.intPage(os.payload.count);
                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取订单列表失败", e);
            this.layer.close(loading)
        })
    }

    // 初始化分页
    intPage(count: number) {
        var that = this;
        layui.use('laypage', function () {

            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'laypage-orders', //注意，这里的 test1 是 ID，不用加 # 号
                count: count, //数据总数，从服务端得到
                limit: that.size, //一页展示多少条数据
                curr: that.current_page, //当前页current_page
                jump: function (obj, first) {
                    if (!first) {
                        that.current_page = obj.curr
                        that.size = obj.limit
                        that.getList()
                    }
                }
            });

        });
    }

    parse_date(s: any) {
        if (s) {
            return Utils.parseTime(s, '')
        } else {
            return ''
        }
    }

    parseStatus(status) {
        // 支付状态 0未支付 1已支付 2已取消
        if (status == 0) {
            status = "未支付"
        } else if (status == 1) {
            status = "已支付"
        } else if (status == 2) {
            status = "已取消"
        } else {
            status = "未知状态"
        }
        return status
    }

    // 去查看订单详情
    goOrder(item) {
        this.router.navigate('order_details', item)
    }

}
