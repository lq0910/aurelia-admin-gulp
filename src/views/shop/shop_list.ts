import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/teamy/utils';
import { Shop, ShopService } from '../../api/shop'
import * as QRCode from '../../../js/qrcode.min.js'
declare var layui
// declare var QRCode
export class Listshop {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    shopservice: ShopService
    readonly: boolean;
    qrcode: QRCode
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    shop_list: Shop;
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

    // 获取店铺列表
    getListshop() {

        var loading = this.layer.load(2);
        this.shopservice.list_shop().then(
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

    isDel(id: string) {
        this.layer.open({
            content: '确认要删除此店铺？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(id)
            }
        });
    }

    // 删除店铺
    delShop(id: string) {
        console.log('id', id);
        this.shopservice.delshop(id).then(
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
            console.log("删除店铺失败", e);
        })
    }

    // qrCode
    qrCode(item) {
        console.log('qecode obj', item);
        const QR = {
            "box_id": item.user_id
            // "shop_name": item.s_name
        }
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            // text: item.user_id,
            width: 220,
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        qrcode.makeCode('http://gl.dongyilike.com/box?code=' + JSON.stringify(QR));

        setTimeout(() => {
            this.downloadClick(item)
        }, 1000);
        console.log('qrcode', qrcode);

    }

    // download qrcode
    downloadClick(item) {
        // 获取base64的图片节点
        var img = document.getElementById('qrcode').getElementsByTagName('img')[0];
        // 构建画布
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        // 构造url
        var url = canvas.toDataURL('image/png');
        // 构造a标签并模拟点击
        var downloadLink = document.getElementById('downloadLink');
        downloadLink.setAttribute('href', url);
        downloadLink.setAttribute('download', item.s_name + '.png');
        downloadLink.click();
    }

    // 去新增
    goAddshop() {
        this.router.navigate('add_shop', '')
    }

    // 去查看
    goSeeshop(item) {
        this.router.navigate('see_shop', item)
    }

    // 去修改
    goUpdateshop(item) {
        this.router.navigate('update_shop', { type: 'update', item })
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
