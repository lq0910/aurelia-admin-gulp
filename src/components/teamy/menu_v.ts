import { TabRouter } from './tab_router.js';
//import { Init } from '../sumu/init';
import { customElement, TaskQueue } from 'aurelia-framework';
// declare var M;
@customElement('menu-v')
export class MenuV {
    router: TabRouter;
    menus: Array<Menu>;
    sidbar: any;
    taskQueue: TaskQueue
    collapsed: boolean = false;
    option = {
        nav_color: 'grey darken-4',//侧边栏颜色
        nav_text_color: 'white-text',//侧边栏一级菜单字体颜色
        logo: 'img/caredaily.png',//侧边栏LOGO,文件地址
        subnav_color: 'grey darken-3',//二级菜单展开颜色
        subnav_text_color: 'white-text',//二级菜单字体颜色
        icon_color: 'color:#bdbdbd'//图标颜色
    }

    static inject() { return [TabRouter, TaskQueue] };
    constructor(r, t) {
        console.log("constructor...");

        this.router = r;
        this.taskQueue = t;
    }
    activate() {
        console.log("sidebar activate");

    }
    menusChanged() {
        console.log("menus changed...", this.menus);

        // this.taskQueue.queueMicroTask(() => {
        //     console.log(M);

        // })

    }

    attached() {
        console.log("sidebar attached");
        //this.creat_menus(this.router.navigation);
        // $(".button-collapse").sideNav();
        // $('.collapsible').collapsible();

    }
    configure(routes: any) {
        console.log(routes);

        let root_menus: Array<Menu> = []
        routes.forEach(nav => {
            if (nav.nav) {

                if (nav.settings) {
                    if (nav.settings.menu) {
                        //不是直接链接
                        let item = new MenuItem()
                        item.title = nav.title;
                        item.url = nav.moduleId;
                        item.name = nav.name;
                        item.icon = nav.settings.icon;
                        let m = root_menus.find(it => { return it.title == nav.settings.menu })

                        if (m) {

                            m.sub.push(item)
                        } else {
                            let rm = new Menu();
                            rm.title = nav.settings.menu;
                            rm.url = "javascript:;"
                            rm.icon = nav.settings.icon;
                            rm.sub.push(item)
                            root_menus.push(rm)
                        }
                    } else {
                        let rm = new Menu();
                        rm.title = nav.title;
                        rm.url = "#" + nav.name;
                        rm.icon = nav.settings.icon;
                        root_menus.push(rm)
                    }

                }
            }


        })
        this.menus = root_menus;
        this.menusChanged()
    }

    set_option(option) {
        // console.log(option);
        this.option.nav_color == undefined ? this.option.nav_color : option.nav_color;
        this.option.nav_text_color == undefined ? this.option.nav_text_color : option.nav_text_color;
        this.option.logo == undefined ? this.option.logo : option.logo;
        this.option.subnav_color == undefined ? this.option.subnav_color : option.subnav_color;
        this.option.subnav_text_color == undefined ? this.option.subnav_text_color : option.subnav_text_color;
        this.option.icon_color == undefined ? this.option.icon_color : option.icon_color;
    }

    open_tab(nav) {
        this.router.navigate(nav.name, null)
    }
}
export class Menu {
    title: string;
    url: string;
    sub: Array<MenuItem> = [];
    icon: string;
}
export class MenuItem {
    title: string;
    name: string;
    url: string;
    icon: string;
}