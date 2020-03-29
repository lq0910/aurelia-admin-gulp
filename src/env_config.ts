declare var teamy_profile
export class EnvConfig {
    static debug = false;

    private static server_url_local = "http://192.168.4.6:8080/s"
    // private static server_url_local = "http://localhost:8080/s"
    private static server_url_qa = "http://gl.dongyilike.com/s"
    private static server_url_production = "http://gl.dongyilike.com/s"

    private static oss_server_url_qa = "https://wurenshangchao.oss-cn-huhehaote.aliyuncs.com/"
    private static oss_server_url_production = "https://wurenshangchao.oss-cn-huhehaote.aliyuncs.com/"
    //private static google_maps_api_key="AIzaSyCh-hh8neGGA_eGIUI6m8Py6bz01f5yxiQ"
    public static get profile(): string {
        return ("undefined" === typeof teamy_profile) ? "prod" : teamy_profile
    }
    static get server_url() {
        let url = EnvConfig.server_url_qa;
        if (EnvConfig.profile == "production") {
            url = EnvConfig.server_url_production
        } else if (EnvConfig.profile == "local") {
            url = EnvConfig.server_url_local;
        }
        return url
    }
    static get oss_server_url() {
        let url = EnvConfig.oss_server_url_qa;
        if (EnvConfig.profile == "production") {
            url = EnvConfig.oss_server_url_production
        } else if (EnvConfig.profile == "local") {
            url = EnvConfig.oss_server_url_qa;
        }

        return url
    }
}
export class Constants {

    static Main_Route: Array<any> = [
        { route: ['', 'home'], name: 'home', moduleId: 'src/views/test/test', title: '系统首页', nav: true, settings: { is_home: true, icon: 'layui-icon-home' } },
        // { route: 'login', name: 'login', moduleId: 'src/views/login/login', title: '系统登录', nav: true },
        { route: 'shop_list', name: 'shop_list', moduleId: 'src/views/shop/shop_list', title: '店铺列表', nav: true, settings: { menu: '店铺管理', icon: 'layui-icon-app' } },
        { route: 'add_shop', name: 'add_shop', moduleId: 'src/views/shop/add_shop', title: '添加店铺', nav: false, settings: { menu: '店铺管理', icon: 'add' } },
        { route: 'update_shop', name: 'update_shop', moduleId: 'src/views/shop/update_shop', title: '修改店铺', nav: false, settings: { menu: '店铺管理', icon: 'domain' } },
        { route: 'see_shop', name: 'see_shop', moduleId: 'src/views/shop/see_shop', title: '查看店铺', nav: false, settings: { menu: '店铺管理', icon: 'domain' } },
        { route: 'commodity_list', name: 'commodity_list', moduleId: 'src/views/commodity/commodity_list', title: '商品列表', nav: true, settings: { menu: '商品管理', icon: 'layui-icon-cart-simple' } },
        { route: 'add_commodity', name: 'add_commodity', moduleId: 'src/views/commodity/add_commodity', title: '添加商品', nav: false, settings: { menu: '商品管理', icon: 'toc' } },
        { route: 'update_commodity', name: 'update_commodity', moduleId: 'src/views/commodity/update_commodity', title: '修改商品', nav: false, settings: { menu: '商品管理', icon: 'toc' } },
        { route: 'commodity_class', name: 'commodity_class', moduleId: 'src/views/commodity/commodity_class', title: '分类列表', nav: true, settings: { menu: '商品管理', icon: 'toc' } },
        { route: 'add_commodity_class', name: 'add_commodity_class', moduleId: 'src/views/commodity/add_commodity_class', title: '添加分类', nav: false, settings: { menu: '商品管理', icon: 'toc' } },
        { route: 'update_commodity_class', name: 'update_commodity_class', moduleId: 'src/views/commodity/update_commodity_class', title: '修改分类', nav: false, settings: { menu: '商品管理', icon: 'toc' } },
        { route: 'order_list', name: 'order_list', moduleId: 'src/views/order/order_list', title: '订单列表', nav: true, settings: { menu: '订单管理', icon: 'layui-icon-rmb' } },
        { route: 'order_details', name: 'order_details', moduleId: 'src/views/order/order_details', title: '订单详情', nav: false, settings: { menu: '订单管理', icon: 'layui-icon-rmb' } },
        { route: 'user_list', name: 'user_list', moduleId: 'src/views/user/user_list', title: '用户列表', nav: true, settings: { menu: '用户管理', icon: 'layui-icon-user' } },
        { route: 'user_order', name: 'user_order', moduleId: 'src/views/user/user_order', title: '用户订单', nav: false, settings: { menu: '用户管理', icon: 'layui-icon-user' } },
        { route: 'admin_list', name: 'admin_list', moduleId: 'src/views/authority/admin_list', title: '管理员列表', nav: true, settings: { menu: '权限管理', icon: 'layui-icon-auz' } },
        { route: 'add_admin', name: 'add_admin', moduleId: 'src/views/authority/add_admin', title: '添加管理员', nav: false, settings: { menu: '权限管理', icon: 'person_add' } },
        { route: 'update_admin', name: 'update_admin', moduleId: 'src/views/authority/update_admin', title: '修改管理员', nav: false, settings: { menu: '权限管理', icon: 'person_add' } },
        { route: 'replenish', name: 'replenish', moduleId: 'src/views/replenish/replenish_list', title: '补货员列表', nav: true, settings: { menu: '权限管理', icon: 'perm_identity' } },
        { route: 'replenish_add', name: 'replenish_add', moduleId: 'src/views/replenish/replenish_add', title: '添加补货员', nav: false, settings: { menu: '权限管理', icon: 'perm_identity' } },
        // { route: 'setup', name: 'setup', moduleId: 'src/views/setting/setup', title: '基本设置', nav: true, settings: { menu: '设置', icon: 'layui-icon-set' } },

    ]

    static Login_Route: Array<any> = [
        { route: 'login', name: 'login', moduleId: 'src/views/login/login', title: '系统登录', nav: true },
    ]

}

