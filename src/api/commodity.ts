
import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Commodity {
    id: string = '';
    img_url: string = ''// '商品图片'
    nickname: string = '' //'商品名称'
    type: string = '' //'商品类型'
    price: number = null//'价格'
    stock: number = 0 //库存
    created_time: number //'创建时间'
    goods_num: string = "" // 货号
}

/* Service */
export class CommodityService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };
    login(): Promise<any> {
        let url = "/checkLoginNew?"
        let params = "redirect_uri=&type=accountLogin&userName=uri.chen&passWord=cyl123456";
        return this.http_client.http_post(EnvConfig.server_url + url + params);

    }

    //商品列表
    list_all(): Promise<any> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/sm_commodity/all");
    };
    // 查询商品详情
    select_commodity(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/sm_commodity/select_id?id=" + id);
    };
    // 删除商品
    del_commodity(item): Promise<OperationStatus> {
        return this.http_client.http_post(EnvConfig.server_url + "/sm_commodity/delete", item);
    };
    //添加商品
    add_commodity(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/sm_commodity/insert", item)
    };
    //修改商品
    update_commodity(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/sm_commodity/update", item)
    };
}