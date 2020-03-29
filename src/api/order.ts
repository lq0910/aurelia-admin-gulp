import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Order {
    id: string = ""
    nickname: string = ""
}

/* Service */
export class OrderService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };

    //查询订单列表
    list(item): Promise<OperationStatus> {
        return this.http_client.http_search(EnvConfig.server_url + "/order/sel_order", item)
    };

    //查询订单详情
    order_details(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/order/sel_order_details?order_id=" + id)
    };

}