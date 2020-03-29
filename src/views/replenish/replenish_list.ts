import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/teamy/utils';
import { ShopService } from '../../api/shop'
declare var layui
export class Listreplenish {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    shopservice: ShopService
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    buhuo_list: Array<any> = [];
    static inject() { return [TabRouter, ShopService] };
    constructor(r: TabRouter, shopservice: ShopService) {
        this.router = r;
        this.shopservice = shopservice
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
            that.getListshop()
        }, 500);
    }

    // 获取补货员列表
    getListshop() {
        let loading = this.layer.load(2);
        const role = '补货员'
        this.shopservice.buhuo_list(role).then(
            os => {
                if (os.ok) {
                    console.log("获取补货员列表成功！", os);
                    this.buhuo_list = os.payload
                    // this.uploadInst.upload() // 执行上传店铺图片
                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取补货员列表失败", e);
            this.layer.close(loading)
        })
    }

    isDel(item) {
        this.layer.open({
            content: '确认要删除此补货员？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(item)
            }
        });

    }

    // 删除补货员
    delShop(item) {
        console.log('item', item);
        this.shopservice.buhuo_del(item).then(
            os => {
                if (os.ok) {
                    console.log("删除成功!", os);
                    this.layer.msg('删除成功');
                    this.getListshop() // 刷新列表
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("删除补货员失败", e);
        })
    }

    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

    // 去新增补货员
    goAddbh() {
        console.log('11111111111')
        this.router.navigate('replenish_add', '')
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
