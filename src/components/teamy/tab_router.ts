import { buildQueryString, parseQueryString } from 'aurelia-path'
import { TaskQueue } from 'aurelia-framework';
declare var $
export class TabRouter {

    tabs: Array<TabPage> = []
    navigation: Array<any> = []
    page_index: number = 1
    current_tab: TabPage
    task_queue: TaskQueue;
    static inject() { return [TaskQueue]; };
    constructor(tq) {
        this.task_queue = tq;
    }
    find_query(hash): string {
        let has_param = hash.indexOf("?")
        let q = "";
        if (has_param >= 0) {
            q = hash.substring(hash.indexOf("?") + 1, hash.length)
        }
        return q;
    }
    configure(navs: any) {
        $(window).on('hashchange', (e) => {
            console.log('hash changed', e);
            let q = this.find_query(location.hash);
            let param = null;
            if (q != "") {
                param = parseQueryString(q);
            }
            console.log("HashChange:", q);

            let route = this.find_route_by_hash(location.hash)
            if (route) {
                this.navigate(route.name, param)
            }

        });
        this.navigation = navs;
        this.init()
    }

    init() {
        let home = this.navigation.find(nav => nav.name == 'home')
        let old_hash = location.hash
        let param = this.find_param_by_hash(old_hash)

        let init_page = this.find_route_by_hash(old_hash)
        if (home) {
            this.navigate_not_change_hash(home.name, param)
        }
        if (init_page) {
            if (init_page != home) {
                this.navigate(init_page.name, param)
            }
        }

    }
    find_tab_by_hash(hash): TabPage {
        return this.tabs.find(v => v.hash == hash)
    }
    private find_param_by_hash(hash: string): any {
        let q = this.find_query(hash);
        let param = null;
        if (q != "") {
            param = parseQueryString(q);
        }
        return param
    }

    private find_route_by_hash(hash: string): any {
        console.log("hash:" + hash);
        let has_param = hash.indexOf("?")
        let nav_name = null;
        if (has_param >= 0) {
            nav_name = hash.substring(hash.indexOf("#") + 1, hash.indexOf("?"))
        } else {
            nav_name = hash.substring(hash.indexOf("#") + 1, hash.length)
        }
        let nav = this.navigation.find(v => v.name == nav_name)
        return nav;
    }
    private navigate_not_change_hash(nav_name: string, param: any) {
        let tab = this.do_navigate(nav_name, param)

        this.tabs.forEach(v => v.active = false);
        tab.active = true
    }
    private do_navigate(nav_name: string, param: any): TabPage {
        console.log("导航：" + nav_name);
        console.log("参数：", param);
        let nav = this.navigation.find(v => v.name == nav_name)
        let hash = nav_name == "" ? "" : "#" + nav.name
        if (param != null) {
            let q = buildQueryString(param);
            if(q){
                if(q.length>0){
                     hash += "?" + q;
                }
            }
        }

        let tab = this.tabs.find(v => v.hash == hash)
        if (!tab) {
            tab = new TabPage()
            tab.route_name = nav_name;

            tab.page_id = tab.route_name + "_" + this.page_index;
            this.page_index++;
            tab.hash = hash;
            tab.param = param;
            tab.active = true;
            tab.allow_close = true;
            if(nav.settings){
                if(nav.settings.is_home){
                    tab.allow_close = false;
                }
            }
            tab.url = nav.moduleId;
            tab.title = nav.title;
            this.tabs.push(tab)
        }
        return tab

    }
    refresh_all() {
        console.log("refres...");

        let temp = this.tabs;
        this.tabs = []
        this.task_queue.queueTask(() => {
            this.tabs = temp;
        })

    }
    get_current_tab(): TabPage {
        return this.tabs.find(it => it.active)
    }
    navigate(nav_name: string, param: any) {
        let tab = this.do_navigate(nav_name, param)
        this.select(tab)
    }
    select(tab: TabPage) {
        this.tabs.forEach(v => v.active = false);
        tab.active = true
        if (tab.selected) {
            tab.selected(tab);
        }
        location.hash = tab.hash;
    }
    close(tab: TabPage) {
        let index = this.tabs.indexOf(tab)
        this.tabs.splice(index, 1)
        if (tab.active) {
            let next_active = this.tabs[index - 1]
            next_active.active = true
            location.hash = next_active.hash
        }
    }
}
export class TabPage {
    route_name: string;
    page_id: string;
    title: string;
    active: boolean;
    url: string;
    param: any;
    hash: string;
    allow_close: boolean;
    selected: Function;
}
export class Route {
    route: string
    name: string
    module_url: string
    title: string
    nav: boolean
    home: boolean

}