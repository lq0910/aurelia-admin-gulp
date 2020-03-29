import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { EnvConfig } from "../../env_config"
import { Commodity, CommodityService } from '../../api/commodity'
import { Category, CategoryService } from '../../api/category'
declare var layui

export class Updatecommodity {
    router: TabRouter;
    commodityservice: CommodityService
    from_service: CategoryService
    utils: Utils;
    oss_server_url: string = EnvConfig.oss_server_url;
    readonly: boolean;
    list_all: Array<Category> = [] // 分类列表
    commodity: Commodity = new Commodity();
    myMap: any; // int map
    myfrom: any
    layer: any // layer
    resshop: Commodity // 添加商品返回一个对象
    imgfile: any // 临时图片
    uploadInst: any
    // istype: string = 'add' // update

    static inject() { return [TabRouter, CommodityService, CategoryService] };
    constructor(r: TabRouter, commodityservice: CommodityService, from_service: CategoryService) {
        this.router = r;
        this.commodityservice = commodityservice
        this.from_service = from_service
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        if (param.param != null) {
            this.commodity = param.param.item
            this.commodity.price = param.param.item.price / 100
            // this.istype = param.param.type
        }
    }
    attached() {
        var that = this;

        layui.use(['form', 'layer'], function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                console.log('调用了修改方法');
                that.onUpdate()

                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
            that.myfrom.on('select(commodity_type)', function (data) {
                console.log("选择了商品", JSON.stringify(data.value));
                that.commodity.type = data.value // 赋值商品

            });
            //监听提交
            // that.myfrom.on('submit(demo1)', function (data) {
            //     layer.alert(JSON.stringify(data.field), {
            //         title: '最终的提交信息'
            //     })
            //     return false;
            // });

        });

        this.getList()
        this.uploadShopImg()
    }

    detached() {
        console.log('detached add_commodity');

    }

    // 修改商品
    onUpdate() {
        console.log('this.shop...', this.commodity);
        this.commodity.price = this.commodity.price * 100
        let data = this.commodity
        this.commodityservice.update_commodity(data).then(
            os => {
                if (os.ok) {
                    console.log("修改商品成功！", os);
                    // this.resshop = os.payload
                    this.layer.msg('修改成功')
                    const c_tab = this.router.get_current_tab()
                    setTimeout(() => {
                        this.router.navigate('commodity_list', {})
                        this.router.close(c_tab)
                        this.router.refresh_all()
                    }, 1000);
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加商品失败", e);
        })
    }

    // 获取商品分类列表
    getList() {

        this.from_service.list_all().then(
            os => {
                if (os.ok) {
                    console.log("获取列表成功！", os);
                    this.list_all = os.payload
                    setTimeout(() => {
                        this.myfrom.render('select'); //刷新select选择框渲染
                    }, 300);
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("获取列表失败", e);
        })
    }

    /* 
    **商品图片上传
    */
    uploadShopImg() {
        var that = this;
        layui.use('upload', function () {
            var upload = layui.upload;
            const target_type = 'commodity_img'
            //执行实例
            that.uploadInst = upload.render({
                elem: '#s_img_commodity_update-' + that.commodity.id //绑定元素
                , url: EnvConfig.server_url + '/file/save_tu?target_type=' + target_type //上传接口 + target_type + '&target_id=' + that.resshop.id 
                //, data: { target_type: target_type, target_id: that.resshop.id }
                , auto: true //选择文件后不自动上传
                , bindAction: '#onsub' //指向一个按钮触发上传
                , done: function (res) {
                    console.log('店铺图片上传成功', res);
                    //上传完毕回调
                    that.commodity.img_url = res.payload.url

                }
                , choose: function (obj) {
                    //将每次选择的文件追加到文件队列
                    var files = obj.pushFile();
                    console.log('files', files);

                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                    obj.preview(function (index, file, result) {
                        console.log(index); //得到文件索引
                        console.log(file); //得到文件对象
                        console.log(result); //得到文件base64编码，比如图片
                        // $('#demo1').attr('src', result); //图片链接（base64）
                        that.imgfile = result
                        console.log('imgfile', that.imgfile);

                        //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增

                        //这里还可以做一些 append 文件列表 DOM 的操作

                        //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                        //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                    });
                }
                , error: function (err) {
                    //请求异常回调
                    console.log('店铺图片上传失败', err);
                }
            });
        });
    }

    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }
}
