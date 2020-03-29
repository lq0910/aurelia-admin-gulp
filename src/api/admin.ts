
import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Admin {
    id: string = ""
    phone: string = ""
    password: string = ""
    // created: null,
    nickname: string = ""
    role: string = "admin"
    region: string = "" // 区域
    email: string = ""
}

/* Service */
export class AdminService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };
    login(admin: Admin): Promise<any> {
        let url = "/admin/admin_login"
        // let params = "redirect_uri=&type=accountLogin&userName=uri.chen&passWord=cyl123456";
        return this.http_client.http_post(EnvConfig.server_url + url, admin);

    }

    //getUser
    getUser(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/admin/get");
    };
    //管理员列表
    list_all(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/admin/admin_all");
    };
    // 删除管理员
    del_admin(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/admin/delete?id=" + id);
    };
    //添加管理员
    add_admin(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/admin/insert", item)
    };
    //修改店铺
    update_admin(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/admin/update", item)
    };
    //根据对象的ID获取整个对象；
    get_by_id(id: string): Promise<any> {
        return this.http_client.http_get(EnvConfig.server_url + "/uf/news/getProcurementMessage?newsId=" + id)
    };
}