import { Router } from 'aurelia-router';
import { Admin, AdminService } from '../../api/admin'
//import { Utils } from '../../components/teamy/utils';

declare var layui;
export class Login {
    router: Router;
    admin: Admin = new Admin();
    adminservice: AdminService
    xa: Array<any> = []
    xb: Array<any> = []
    myfrom: any
    layer: any // layer
    year: string
    static inject() { return [Router, AdminService] };
    constructor(r: Router, adminservice: AdminService) {
        this.router = r;
        this.adminservice = adminservice
    }

    activate() {
    }
    attached() {
        var that = this;
        layui.use('form', function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                that.login() // 执行登录
                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
        });

        const y = new Date().getFullYear()
        this.year = y.toLocaleString()

    }

    // 登录
    login() {
        console.log('login...', this.admin);
        this.adminservice.login(this.admin).then(
            os => {
                if (os.ok) {
                    console.log("login...", os);
                    this.layer.msg('登录成功')
                    window.location.assign('index.html')
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("登录失败", e);
        })
    }

}
