import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
// import { Utils } from '../../components/teamy/utils';
import { Category, CategoryService } from '../../api/category'
declare var layui
export class Commodity_class {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    from_service: CategoryService
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    list_all: Category;
    selectedProduct = null;
    static inject() { return [TabRouter, CategoryService] };
    constructor(r: TabRouter, from_service: CategoryService) {
        this.router = r;
        this.from_service = from_service
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

    // 获取列表
    getList() {
        var that = this;
        let loading = this.layer.load(2);
        this.from_service.list_all().then(
            os => {
                if (os.ok) {
                    console.log("获取列表成功！", os);
                    this.list_all = os.payload
                    setTimeout(() => {
                        layui.use('form', function () {
                            var form = layui.form;

                            form.on('switch(class-del)', function (data) {
                                // console.log(data.elem); //得到checkbox原始DOM对象
                                console.log(data.elem.checked); //开关是否开启，true或者false
                                console.log(data.value); //开关value值，也可以通过data.elem.value得到
                                let del = null;
                                if (data.elem.checked) {
                                    del = 1
                                } else {
                                    del = 2
                                }

                                that.delShop(del, data.value)
                                // console.log(data.othis); //得到美化后的DOM对象
                            });
                        });
                    }, 300);

                } else {
                    this.layer.msg(os.msg);
                }
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取列表失败", e);
            this.layer.close(loading)
        })
    }

    /* isDel(id: string) {
        this.layer.open({
            content: '确认要删除此分类？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delShop(id)
            }
        });

    } */

    /* changeClass() {
        console.log('changeClass', this.currtentClass);
    } */

    // 分类状态更新
    delShop(del, id) {
        console.log('分类状态更新', del, id);
        this.from_service.del_date(del, id).then(
            os => {
                if (os.ok) {
                    console.log("分类状态更新!", os);
                    this.layer.msg('状态更新成功');
                    this.getList() // 刷新列表
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("删除失败", e);
        })
    }

    // 去新增
    goAdd() {
        this.router.navigate('add_commodity_class', '')
    }

    // 去修改
    goUpdate(item) {
        this.router.navigate('update_commodity_class', { type: 'update', item })
    }

}
