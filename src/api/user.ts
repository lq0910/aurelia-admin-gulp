import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class User {
    id: string = ""
    nickname: string = ""
}

/* Service */
export class UserService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };

    //管理员列表
    list_all(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/admin/admin_all");
    };
    // 用户列表
    list_user(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/corp_user/get_user_weixin");
    };
    // 用户订单列表
    sel_order_by_user(id: string): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/order/sel_order_by_user?user_id=" + id);
    };
    // 删除管理员
    del_admin(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/admin/delete?id=" + id);
    };

}