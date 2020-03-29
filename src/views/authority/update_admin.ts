import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
// import { EnvConfig } from "../../env_config"
import { Admin, AdminService } from '../../api/admin'
declare var layui

export class Updateadmin {
    router: TabRouter;
    adminservice: AdminService
    utils: Utils;
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    admin: Admin = new Admin();
    myMap: any; // int map
    myfrom: any
    layer: any // layer
    districtSearch: ''
    district: any
    provinceList: Array<any> = []
    currentProvince: any
    polygons: Array<any> = []
    cityList: Array<any> = []
    districtList: Array<any> = []
    countryList: Array<any> = []
    resadmin: Admin // 添加管理员返回一个对象
    imgfile: any // 临时图片
    uploadInst: any
    // istype: string = 'add' // update

    static inject() { return [TabRouter, AdminService] };
    constructor(r: TabRouter, adminservice: AdminService) {
        this.router = r;
        this.adminservice = adminservice
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        if (param.param != null) {
            this.admin = param.param.item
            // this.istype = param.param.type
        }
    }
    deactivated() {
        this.admin = null
    }
    attached() {

        var that = this;

        layui.use('form', function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                console.log('调用了修改方法');
                that.onUpdateAdmin()

                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
            that.myfrom.on('select(role_update)', function (data) {
                console.log("选择了角色", JSON.stringify(data.value));
                that.admin.role = data.value // 赋值省编码

            });
            //自定义验证规则
            that.myfrom.verify({
                title: function (value) {
                    if (value.length > 5) {
                        return '姓名不能大于5个字符';
                    }
                }
                , pass: [
                    /^[\S]{6,12}$/
                    , '密码必须6到12位，且不能出现空格'
                ]
                , content: function (value) {
                    // layedit.sync(editIndex);
                }
            });
            //监听提交
            // that.myfrom.on('submit(demo1)', function (data) {
            //     layer.alert(JSON.stringify(data.field), {
            //         title: '最终的提交信息'
            //     })
            //     return false;
            // });

        });
        setTimeout(() => {
            this.myfrom.render('select'); //刷新select选择框渲染
        }, 300);
    }

    detached() {
        console.info("detached");
    }

    // 修改管理员
    onUpdateAdmin() {
        console.log('this.admin...', this.admin);
        let data = this.admin
        this.adminservice.update_admin(data).then(
            os => {
                if (os.ok) {
                    console.log("修改管理员成功！", os);
                    // this.resadmin = os.payload
                    this.layer.msg('修改成功')
                    setTimeout(() => {
                        this.router.navigate('admin_list', {})
                        this.router.refresh_all()
                    }, 1000);
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加管理员失败", e);
        })
    }

}
