import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { Order, OrderService } from '../../api/order';
import { EnvConfig } from "../../env_config"
declare var layui
export class Orderdetails {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    orderservice: OrderService
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    order: Order
    order_list: Array<any> = [];
    utils: Utils;
    oss_server_url: string = EnvConfig.oss_server_url;
    static inject() { return [TabRouter, OrderService, Utils] };
    constructor(r: TabRouter, orderservice: OrderService, utils: Utils) {
        this.router = r;
        this.orderservice = orderservice;
        this.utils = utils
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        this.order = param.param
        var that = this;
        layui.use('layer', function () {
            that.layer = layui.layer;
        })
    }
    attached() {
        /*  var that = this;
         layui.use('layer', function () {
             that.layer = layui.layer;
         }) */
        var that = this;
        setTimeout(function () {
            that.getList()
        }, 500);
        this.order_list = null
    }

    // 获取订单详情
    getList() {

        var loading = this.layer.load(2);
        this.orderservice.order_details(this.order.id).then(
            os => {
                if (os.ok) {
                    console.log("获取订单详情", os);
                    this.order_list = os.payload

                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取订单详情", e);
            this.layer.close(loading)
        })
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

}
