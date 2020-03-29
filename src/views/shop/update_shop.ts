import { TabRouter } from '../../../node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js';
import { Utils } from '../../components/utils';
import { EnvConfig } from "../../env_config"
import { Shop, ShopService } from '../../api/shop'
declare var layui
declare var AMap
export class Updateshop {
    router: TabRouter;
    shopservice: ShopService
    utils: Utils;
    oss_server_url: string = EnvConfig.oss_server_url;
    xa: Array<any> = []
    xb: Array<any> = []
    shop: Shop = new Shop();
    myMap: any; // int map
    myfrom: any
    layer: any // layer
    districtSearch: ''
    district: any
    provinceList: Array<any> = []
    currentProvince: any
    polygons: Array<any> = []
    cityList: Array<any> = []
    districtList: Array<any> = []
    countryList: Array<any> = []
    resshop: Shop // 添加店铺返回一个对象
    imgfile: any // 临时图片
    uploadInst: any
    // istype: string = 'add' // update
    lat: string = '' // lat
    lon: string = '' // 
    province_id: string = '' // province_id
    city_id: string = '' // city_id
    county_id: string = '' // county_id

    static inject() { return [TabRouter, ShopService] };
    constructor(r: TabRouter, shopservice: ShopService) {
        this.router = r;
        this.shopservice = shopservice
    }

    activate(param) {
        console.log('打印父页面传来参数', param);
        if (param.param != null) {
            this.shop = param.param.item
            this.lat = this.shop.lat
            this.lon = this.shop.lon
        }
    }
    attached() {
        this.initLayui()
        this.initAMap()
        this.uploadShopFm() // 方法初始化

    }

    detached() {
        this.myMap && this.myMap.destroy();
        console.info("地图已销毁");
    }

    // 初始化layui
    initLayui() {
        var that = this;
        layui.use('form', function () {
            that.myfrom = layui.form;
            that.layer = layui.layer;
            //监听提交
            that.myfrom.on('submit(from)', function (data) {
                console.log('form data...', data);
                console.log('调用了修改方法');
                that.onUpdateShop()

                return false
                //that.layer.msg(JSON.stringify(data.field));
            });
            that.myfrom.on('select(province)', function (data) {
                console.log("选择了省", JSON.stringify(data.value));
                that.province_id = data.value // 赋值省编码
                that.search(data.value)
            });
            that.myfrom.on('select(city)', function (data) {
                console.log("选择了市", JSON.stringify(data.value));
                that.city_id = data.value // 赋值市编码
                that.search(data.value)
            });
            that.myfrom.on('select(country)', function (data) {
                console.log("选择了县", JSON.stringify(data.value));
                that.county_id = data.value // 赋值地区编码
                // that.search(data.value)
                that.myMap.setCity(data.value);
                that.myMap.setZoom(10);
                //this.myMap.setCenter(result.districtList[0].center);
                // 地图自适应
                that.myMap.setFitView();//地图自适应
            });
            //监听提交
            // that.myfrom.on('submit(demo1)', function (data) {
            //     layer.alert(JSON.stringify(data.field), {
            //         title: '最终的提交信息'
            //     })
            //     return false;
            // });

        });
    }

    initAMap() {
        console.log('地图初始化....');

        this.myMap = new AMap.Map('container-update', {
            resizeEnable: true,
            zoom: 11,//级别
            center: [109.986422, 39.79819]//中心点坐标
            //viewMode: '3D'//使用3D视图
        });
        // 点选地图位置的回调
        this.myMap.on('click', (e) => {
            console.log('选择了位置...', e, e.lnglat.toString());
            let lnglat = e.lnglat.toString().split(',')
            console.log('lnglat', lnglat);

            this.lat = lnglat[1]
            this.lon = lnglat[0]
        });

        var _this = this;
        //行政区划查询
        var opts = {
            extensions: 'all',
            subdistrict: 1,   //返回下一级行政区
            showbiz: false,  //最后一级返回街道信息
            // level: 'district'
        };
        this.district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
        this.district.search('中国', function (status, result) {
            if (status == 'complete') {
                console.log('DistrictSearch result', result);
                _this.provinceList = result.districtList[0]['districtList']
                //_this.getData(result.districtList[0])
                setTimeout(() => {
                    _this.myfrom.render('select'); //刷新select选择框渲染
                }, 300);
                setTimeout(() => {
                    _this.search(_this.shop.province_id)
                }, 400);
                setTimeout(() => {
                    _this.search(_this.shop.city_id)
                }, 500);
            }
        });
    }

    search(obj) {
        console.log('obj', obj);

        //清除地图上所有覆盖物
        for (var i = 0, l = this.polygons.length; i < l; i++) {
            this.polygons[i].setMap(null);
        }
        //var option = obj[obj.options.selectedIndex];
        //var keyword = option.text; //关键字
        var adcode = obj;
        this.district.setLevel('city'); //行政区级别
        this.district.setExtensions('all');

        //行政区查询
        //按照adcode进行查询可以保证数据返回的唯一性
        this.district.search(adcode, (status, result) => {
            if (status === 'complete') {
                console.log('下级查询', result);

                if (result.districtList[0].level == 'province') {
                    this.cityList = [...result.districtList[0]['districtList']]
                    console.log('province', result.districtList[0].level, this.cityList);

                } else {
                    this.countryList = [...result.districtList[0]['districtList']]
                }
                setTimeout(() => {
                    this.myfrom.render('select'); //刷新select选择框渲染
                }, 300);

                //this.getData(result.districtList[0],obj.id);

                // this.myMap.event.addListener('select', (e)=>{
                //     if (e.poi && e.poi.location) {
                //         this.myMap.setZoom(15);
                //         this.myMap.setCenter(e.poi.location);
                //     }
                // });//注册监听，当选中某条记录时会触发
                this.myMap.setCity(adcode);
                this.myMap.setZoom(10);
                //this.myMap.setCenter(result.districtList[0].center);
                // 地图自适应
                this.myMap.setFitView();//地图自适应
            }

            //var bounds = result.districtList[0].boundaries
            //this.myMap.remove(this.polygons)//清除上次结果
            //this.polygons = []

            /*  if (bounds) {
                 for (var i = 0, l = bounds.length; i < l; i++) {
                     //生成行政区划polygon
                     var polygon = new AMap.Polygon({
                         map: this.myMap,
                         strokeWeight: 1,
                         path: bounds[i],
                         // fillOpacity: 0.7,
                         // fillColor: '#CCF3FF',
                         // strokeColor: '#CC66CC'
                     })
                     this.polygons.push(polygon)
                 }
                 
                 // 地图自适应
                 this.myMap.setFitView(this.polygons);//地图自适应
             } */

        });
    }

    // 修改店铺
    onUpdateShop() {
        let data = this.shop
        // data.province_id = this.province_id
        // data.city_id = this.city_id
        // data.county_id = this.county_id

        console.log('this.shop... data', this.shop, data);
        this.shopservice.update_shop(data).then(
            os => {
                if (os.ok) {
                    console.log("修改店铺成功！", os);
                    // this.resshop = os.payload
                    this.layer.msg('修改成功')
                    setTimeout(() => {
                        this.router.navigate('shop_list', {})
                        this.router.refresh_all()
                    }, 1000);
                } else {
                    this.layer.msg(os.msg);
                }

            }
        ).catch(e => {
            console.log("添加店铺失败", e);
        })
    }

    /* 
   店铺封面上传
   */
    uploadShopFm() {
        var that = this;
        layui.use('upload', function () {
            var upload = layui.upload;
            const target_type = 'shop_img'
            //执行实例
            that.uploadInst = upload.render({
                elem: '#s_img_shop_update' //绑定元素
                , url: EnvConfig.server_url + '/file/save_tu?target_type=' + target_type //上传接口 + target_type + '&target_id=' + that.resshop.id 
                //, data: { target_type: target_type, target_id: that.resshop.id }
                , auto: true //选择文件后不自动上传
                , bindAction: '#onsub' //指向一个按钮触发上传
                , done: function (res) {
                    console.log('店铺图片上传成功', res);
                    //上传完毕回调
                    that.shop.s_img = res.payload.url

                }
                , choose: function (obj) {
                    //将每次选择的文件追加到文件队列
                    var files = obj.pushFile();
                    console.log('files', files);

                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                    obj.preview(function (index, file, result) {
                        console.log(index); //得到文件索引
                        console.log(file); //得到文件对象
                        console.log(result); //得到文件base64编码，比如图片
                        // $('#demo1').attr('src', result); //图片链接（base64）
                        that.imgfile = result
                        console.log('imgfile', that.imgfile);

                        //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增

                        //这里还可以做一些 append 文件列表 DOM 的操作

                        //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                        //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                    });
                }
                , error: function (err) {
                    //请求异常回调
                    console.log('店铺图片上传失败', err);
                }
            });
        });
    }


    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }

    remove() {
        Utils.removeFromArray(this.xa, (a) => { return a.found })
        Utils.removeFromArray(this.xb, (b) => { return b.found })
    }


}
