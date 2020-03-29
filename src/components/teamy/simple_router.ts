
import { TaskQueue } from 'aurelia-framework';
export class SimpleRouter {

    navigation: Array<any> = []
    page_index: number = 1
    current_route: Route;
    task_queue: TaskQueue;
    static inject() { return [TaskQueue]; };
    constructor(tq) {
        this.task_queue = tq;
    }
    
    configure(navs: any) {
       
        this.navigation = navs;
        this.init()
    }

    init() {
        let home = this.navigation.find(nav => nav.route == '')
        console.log("init home",home);
        
        this.navigate(home.name)

    }
  
    navigate(nav_name: string) {
        console.log("nav...");
        
        let r = this.navigation.find(nav => nav.name == nav_name)
       this.current_route=r
    }
  
}

export class Route {
    route: string
    name: string
    module_url: string
    title: string
    nav: boolean
    home: boolean

}