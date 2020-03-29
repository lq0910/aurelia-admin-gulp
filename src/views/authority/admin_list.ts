import { TabRouter, TabPage } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/teamy/utils';
import { Admin, AdminService } from '../../api/admin'
declare var layui
export class Listadmin {
    router: TabRouter;
    tabs: Array<TabPage> = [];
    adminservice: AdminService
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    layer: any // layer
    admin_list: Admin;
    static inject() { return [TabRouter, AdminService] };
    constructor(r: TabRouter, adminservice: AdminService) {
        this.router = r;
        this.adminservice = adminservice
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

        this.getList()
    }

    // 获取管理员列表
    getList() {
        let loading = this.layer.load(2);
        this.adminservice.list_all().then(
            os => {
                /*  if (os.ok) {
                   
                 } else {
                     this.layer.msg(os.msg);
                 } */
                console.log("获取管理员列表成功！", os);
                this.admin_list = os
                this.layer.close(loading)
            }
        ).catch(e => {
            console.log("获取管理员列表失败", e);
            this.layer.close(loading)
        })
    }

    isDel(id: string) {
        this.layer.open({
            content: '确认要删除此管理员？',
            yes: (layero, index) => {
                console.log(layero, index);
                this.delSubmit(id)
            }
        });

    }

    // 删除管理员
    delSubmit(id: string) {
        console.log('id', id);
        this.adminservice.del_admin(id).then(
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
            console.log("删除店铺失败", e);
        })
    }

    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

    // 去新增
    goAddadmin() {
        this.router.navigate('add_admin', '')
    }

    // 去修改
    goUpdateadmin(item) {
        this.router.navigate('update_admin', { type: 'update', item })
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
