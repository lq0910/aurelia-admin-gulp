import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Iidex {
    id: string = ""
    nickname: string = ""
}

/* Service */
export class IndexService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };

    //当前在线使用服务用户列表
    users_online(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url +"https://dykj.test.teamy.cn/users");
    };

    //查询总订单和总交易额
    order_all(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_post(EnvConfig.server_url + "/order/sel_order_all");
    };

    // 删除管理员
    del_admin(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/admin/delete?id=" + id);
    };

}