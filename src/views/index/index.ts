import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { IndexService } from '../../api/index'
// import { Utils } from '../../components/teamy/utils';
declare var layui
export class Homeindex {
    router: TabRouter;
    onlines: Array<any> = []
    indexservice: IndexService
    layer: any
    sum_order: number = 0 // 总订单数
    sum_volume: number = 0 // 总交易额
    static inject() { return [TabRouter, IndexService] };
    constructor(r: TabRouter, indexservice: IndexService) {
        this.router = r;
        this.indexservice = indexservice
    }

    activate() {
        var that = this;
        layui.use('layer', function () {
            that.layer = layui.layer;
        })
    }
    attached() {
        //this.getUsers()
        this.get_users_order_all()
    }

    getUsers() {
        this.indexservice.users_online().then(
            os => {
                // this.onlines = os
                os.forEach(element => {
                    let aa = element.toString().match(/name=(\S*),/)[1];
                    this.onlines.push(aa)
                });
                console.log("打印在线用户列表", this.onlines);
            }
        )
    }

    //查询总订单和总交易额
    get_users_order_all() {
        this.indexservice.order_all().then(
            os => {
                // this.onlines = os
                this.sum_order = os.payload.sum_order
                this.sum_volume = os.payload.count
                console.log("打印总订单和总交易额", os);
            }
        )
    }

    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

}
