import { Router, RouterConfiguration } from 'aurelia-router';
// import { Init } from './init';
import { Constants } from './env_config';
// declare var $

export class AppLogin {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        console.log("config router...");

        config.map(Constants.Login_Route);
        this.router = router;
        // console.log(this.router);

    }
    activate() {

    }
    attached() {

    }
    goto_page(page_name, param) {
        this.router.navigateToRoute(page_name, { 'data': param });
    }
}