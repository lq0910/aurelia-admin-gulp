import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { User, UserService } from '../../api/user'
declare var layui
export class Userorder {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    userservice: UserService
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    user: User
    order_list: Array<any> = [];
    utils: Utils;
    static inject() { return [TabRouter, UserService, Utils] };
    constructor(r: TabRouter, userservice: UserService, utils: Utils) {
        this.router = r;
        this.userservice = userservice;
        this.utils = utils
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        this.user = param.param
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

    // 获取用户订单列表
    getList() {

        var loading = this.layer.load(2);
        this.userservice.sel_order_by_user(this.user.id).then(
            os => {
                if (os.ok) {
                    console.log("获取用户订单列表", os);
                    this.order_list = os.payload

                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取用户订单列表", e);
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
