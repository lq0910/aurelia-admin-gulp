import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/teamy/utils';
import { Commodity, CommodityService } from '../../api/commodity'
import { EnvConfig } from "../../env_config"
declare var layui
export class Commoditylist {
    router: TabRouter;
    commodityservice: CommodityService
    tabs: Array<TabPage> = [];
    currentTab: TabPage;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    commodity: Commodity = new Commodity();
    layer: any // layer
    list: Array<Commodity> = [];
    oss_server_url: string = EnvConfig.oss_server_url;
    static inject() { return [TabRouter, CommodityService] };
    constructor(r: TabRouter, commodityservice: CommodityService) {
        this.router = r;
        this.commodityservice = commodityservice
    }

    activate(param) {
        var that = this;
        console.log('打印父页面传来参数', param);
        layui.use('layer', function () {
            that.layer = layui.layer;
        })
    }
    attached() {
        var that = this;
        setTimeout(function () {
            that.getList()
        }, 500);
    }

    // 去新增
    goAdd() {
        this.router.navigate('add_commodity', '')
    }

    // 去修改
    goUpdate(item) {
        // this.router.close(tab)
        this.router.navigate('update_commodity', { type: 'update', item })
    }

    // 获取商品列表
    getList() {
        let loading = this.layer.load(2);
        this.commodityservice.list_all().then(
            os => {
                if (os.ok) {
                    console.log("获取商品列表成功！", os);
                    this.list = os.payload
                    // this.uploadInst.upload() // 执行上传商品图片
                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取商品列表失败", e);
            this.layer.close(loading)
        })
    }

    isDel(row) {
        this.layer.open({
            content: '确认要删除此商品？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(row)
            }
        });

    }

    // 删除商品
    delShop(row) {
        console.log('row', row);
        this.commodityservice.del_commodity(row).then(
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
