import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/teamy/utils';
import { Shop, ShopService } from '../../api/shop'
import { EnvConfig } from "../../env_config"
declare var layui
export class Seeshop {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    shopservice: ShopService
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    shop_list: Shop;
    pramshop:Shop;
    oss_server_url: string = EnvConfig.oss_server_url;
    static inject() { return [TabRouter, ShopService] };
    constructor(r: TabRouter, shopservice: ShopService) {
        this.router = r;
        this.shopservice = shopservice
    }

    activate(param) {
        var that = this;
        layui.use('layer', function () {
            that.layer = layui.layer;
        })
        that.pramshop = param.param;
        console.log('打印父页面传来参数', param.param);
        console.log(that.pramshop)
    }
    attached() {
        /*  var that = this;
         layui.use('layer', function () {
             that.layer = layui.layer;
         }) */

        this.getListshop()
    }

    // 获取店铺列表
    getListshop() {
        console.log('idddddddddddddddddd',this.pramshop.id)
        let loading = this.layer.load(2);
        this.shopservice.sel_shop_id(this.pramshop.id).then(
            os => {
                if (os.ok) {
                    console.log("获取店铺列表成功！", os);
                    this.shop_list = os.payload
                    // this.uploadInst.upload() // 执行上传店铺图片
                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取店铺列表失败", e);
            this.layer.close(loading)
        })
    }
    //通过店铺id删除商品
    isDel(id: string) {
        this.layer.open({
            content: '确认要删除此商品？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(id)
            }
        });

    }

    delShop(id: string) {
        console.log('id', id);
        this.shopservice.del_shop_id(id).then(
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
            console.log("删除商品失败", e);
        })
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
