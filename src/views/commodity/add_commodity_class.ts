import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
// import { EnvConfig } from "../../env_config"
import { Category, CategoryService } from '../../api/category'
declare var layui

export class Addcommodity_class {
    router: TabRouter;
    from_service: CategoryService
    utils: Utils;
    from_date: Category = new Category();
    myfrom: any
    layer: any // layer
    // list_all: Category // category_list
    // istype: string = 'add' // update

    static inject() { return [TabRouter, CategoryService] };
    constructor(r: TabRouter, from_service: CategoryService) {
        this.router = r;
        this.from_service = from_service
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        if (param.param != null) {
            this.from_date = param.param.item
            // this.istype = param.param.type
        }
    }
    attached() {

        var that = this;

        layui.use('form', function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                that.onSubmit()

                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
            // that.myfrom.on('select(province)', function (data) {
            //     console.log("选择了省", JSON.stringify(data.value));
            //     that.shop.province_id = data.value // 赋值省编码

            // });
            //监听提交
            // that.myfrom.on('submit(demo1)', function (data) {
            //     layer.alert(JSON.stringify(data.field), {
            //         title: '最终的提交信息'
            //     })
            //     return false;
            // });

        });
    }

    detached() {
        console.info("detached");
    }

    // 新增
    onSubmit() {
        console.log('from_date...', this.from_date);
        let data = this.from_date
        this.from_service.add_date(data).then(
            os => {
                if (os.ok) {
                    console.log("添加成功！", os);
                    // this.resshop = os.payload
                    this.layer.msg('添加成功')
                    setTimeout(() => {
                        this.router.navigate('commodity_class', {})
                        this.router.refresh_all()
                    }, 1000);
                    // this.uploadInst.upload() // 执行上传管理员图片
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加失败", e);
        })
    }

    // 修改管理员
    onUpdate() {
        console.log('from_date...', this.from_date);
        let data = this.from_date
        this.from_service.update_date(data).then(
            os => {
                if (os.ok) {
                    console.log("修改成功！", os);
                    this.layer.msg('修改成功')
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加失败", e);
        })
    }

}
