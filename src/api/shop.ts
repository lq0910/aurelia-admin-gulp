
import { OperationStatus, HttpJsonClient } from "../../node_modules/teamy-utils/dist/utils.js";
import { EnvConfig } from "../env_config"
/* vo  */
export class Shop {
    id: string = '';
    s_img: string = ''// '店铺图片'
    s_name: string = '' //'店铺名称'
    province_id: string = '' //'省id'
    city_id: string = '' //'市id'
    county_id: string = ''//'区id'
    address: string = '' //'详细地址'
    lon: string = '' //'经度'
    lat: string = '' //'纬度'
    agent_id: string = ''//'代理商id'
    status: number = 0//'店铺状态 1开店 0闭店盘点 2删除'
    created_time: number //'创建时间'
    corpUser: CorpUser = new CorpUser();
}

export class CorpUser {
    username: string = ''
    password: string = '';
    role: string = 'USER';
}
export class Replenish {
    id: string = '';
    nickname: string = ''
    phone: string = '';
    password: string = '';
    role: string = '补货员'
}
/* Service */
export class ShopService {
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

    //店铺列表
    list_shop(): Promise<any> {
        // var params = { "filter": {}, "pageIndex": 0, "pageSize": 10, "count": -1 };
        return this.http_client.http_get(EnvConfig.server_url + "/sm_shop/see_all");
    };
    // 删除店铺
    delshop(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/sm_shop/del?id=" + id);
    };
    //添加店铺
    add_shop(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/sm_shop/insert", item)
    };
    //修改店铺
    update_shop(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/sm_shop/update", item)
    };
    //补货员列表
    buhuo_list(item): Promise<any> {
        return this.http_client.http_get(EnvConfig.server_url + "/corp_user/list1?role=" + item)
    };
    //添加补货员
    buhuo_add(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/corp_user/create", item)
    };
    //删除补货员
    buhuo_del(item): Promise<OperationStatus> {

        return this.http_client.http_post(EnvConfig.server_url + "/corp_user/delete", item)
    };
    //根据店铺id查询商品
    sel_shop_id(id: string): Promise<OperationStatus> {

        return this.http_client.http_get(EnvConfig.server_url + "/goods/sel_shop_id?shop_id=" + id)
    };




    // 删除店铺
    del_shop_id(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/goods/delete?id=" + id);
    };
    //根据对象的ID获取整个对象；
    get_by_id(id: string): Promise<any> {
        return this.http_client.http_get(EnvConfig.server_url + "/uf/news/getProcurementMessage?newsId=" + id)
    };
    //根据对象的ID删除对象；
    delete(id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/worklog/delete?id=" + id)
    };
    update_item(ins: any): Promise<OperationStatus> {
        return this.http_client.http_post(EnvConfig.server_url + "/uf/groupItem/update", ins)
    }

    upload_attachment(ins_id: string, attachment_type: string, form_data: any): Promise<OperationStatus> {
        return this.http_client.http_post_form(EnvConfig.server_url + "/worklog/upload_attachment?id=" + ins_id + "&type=" + attachment_type, form_data)
    }
    del_attachment(attachment_id: string): Promise<OperationStatus> {
        return this.http_client.http_get(EnvConfig.server_url + "/worklog/del_attachment?id=" + attachment_id)
    };
}