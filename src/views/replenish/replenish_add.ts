import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
// import { Utils } from '../../components/teamy/utils';
import { Replenish,ShopService } from '../../api/shop'
declare var layui
export class Listreplenish {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    shopservice: ShopService
    readonly: boolean;
    au: string;
    myfrom: any;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    Rph: Replenish = new Replenish();
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
        var that = this;
        layui.use('form', function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                // if (that.istype == 'add') {
                    that.onSubmitShop()
                // } else {
                //     console.log('调用了修改方法');
                //     that.onUpdateShop()
                // }

                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
        })
    }

    // 去新增补货员
    onSubmitShop() {
        console.log('this.Rph...', this.Rph);
        this.shopservice.buhuo_add(this.Rph).then(
            os => {
                if (os.ok) {
                    console.log("添加补货员成功！", os);
                    // this.resshop = os.payload
                    this.layer.msg('添加成功')
                    setTimeout(() => {
                        this.router.navigate('replenish', {})
                        this.router.refresh_all()
                    }, 1000);
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加补货员失败", e);
        })
    }

}
