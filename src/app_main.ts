import { TabRouter, TabPage } from '../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Constants } from './env_config';
// import { MenuV } from '../node_modules/teamy-utils/dist/src/cn/teamy/menu_v.js';
import { MenuV } from './components/teamy/menu_v.js';
import { Admin, AdminService } from './api/admin'

// declare var $;
declare var layui;
export class Appmain {
    router: TabRouter;
    isguanliyuan: boolean;
    avatar: string = 'img/profile.png';
    page_param: any;
    tabs: Array<TabPage> = [];
    sidebar: any;
    menu: MenuV
    user: Admin
    adminservice: AdminService
    showSide: boolean = true;
    static inject() { return [TabRouter, AdminService] }
    constructor(t, adminservice: AdminService) {
        this.router = t;
        this.adminservice = adminservice
    }
    headsets
    data = {};


    activate() {
        console.log("activate...");
        //this.getUser();
    }
    attached() {
        layui.use('element', function () {
            var element = layui.element;
            console.log(element);
        });
        this.router.configure(Constants.Main_Route)
        // console.log(this.router);

        this.menu.configure(Constants.Main_Route)
        // $(".dropdown-trigger").dropdown();

        //this.sidebar.configure(this.router)
        // this.router.navigate("home", {});
        // this.add_tab("t")

    }

    // get user
    getUser() {
        const url = '/index_login.html#/login'
        this.adminservice.getUser().then(
            os => {
                if (os.ok) {
                    console.log("get user...", os);
                    this.user = os.payload
                } else {
                    window.location.assign(url);//跳转登陆页
                }

            }
        ).catch(e => {
            console.log("get user error", e);
            window.location.assign(url);//跳转登陆页
        })

    }

    flexible() {
        console.log('onSide...', this.showSide);
        if (this.showSide) {
            this.showSide = false
        } else {
            this.showSide = true
        }

    }

    refresh() {
        console.log(this.router);

        this.router.refresh_all();
    }
}