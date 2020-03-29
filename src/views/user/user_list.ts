import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { UserService } from '../../api/user'
declare var layui
export class Listuser {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    userservice: UserService
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    user_list: Array<any> = [];
    utils: Utils;
    static inject() { return [TabRouter, UserService, Utils] };
    constructor(r: TabRouter, userservice: UserService, utils: Utils) {
        this.router = r;
        this.userservice = userservice;
        this.utils = utils
    }

    activate() {
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
    }

    // 获取用户列表
    getList() {

        var loading = this.layer.load(2);
        this.userservice.list_user().then(
            os => {
                if (os.ok) {
                    console.log("获取用户列表成功！", os);
                    this.user_list = os.payload
                    
                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取用户列表失败", e);
            this.layer.close(loading)
        })
    }

    /* isDel(id: string) {
        this.layer.open({
            content: '确认要删除此用户？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(id)
            }
        });

    } */

    // 删除用户
    /* delShop(id: string) {
        console.log('id', id);
        this.shopservice.delshop(id).then(
            os => {
                if (os.ok) {
                    console.log("删除成功!", os);
                    this.layer.msg('删除成功');
                    this.getList() // 刷新列表
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("删除用户失败", e);
        })
    } */

    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

    // 去新增
    goAddshop() {
        this.router.navigate('add_shop', '')
    }

    // 去查看订单详情
    goOrder(item) {
        this.router.navigate('user_order', item)
    }

    // 去修改
    goUpdateshop(item) {
        this.router.navigate('add_shop', { type: 'update', item })
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
