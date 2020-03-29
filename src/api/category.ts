
import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Category {
    id: string = "" // 分类id
    name: string = "" // 分类名称
    unit: string = "" // 商品单位
    del: string = "1" // 1 正常 2 删除
    created_time: string = ""
}

/* Service */
export class CategoryService {
    http_client: HttpJsonClient;
    static inject() { return [HttpJsonClient]; };
    constructor(http) {
        this.http_client = http;
    };

    //getUser
    getUser(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/admin/get");
    };
    //添加
    add_date(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/category/insert", item)
    };
    //列表
    list_all(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/category/all");
    };
    // 返回启用状态下分类列表
    list_all1(): Promise<OperationStatus> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/category/all1");
    };
    // 分类状态更新
    del_date(del: string, id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/category/update_del?del=" + del + '&id=' + id);
    };
    //修改
    update_date(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/category/update", item)
    };
    //根据对象的ID获取整个对象；
    get_by_id(id: string): Promise<any> {
        return this.http_client.http_get(EnvConfig.server_url + "/uf/news/getProcurementMessage?newsId=" + id)
    };
}