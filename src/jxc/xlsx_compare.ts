
import { XlsxUtils } from '../components/teamy/utils_xlsx';
import { Router } from 'aurelia-router';
import { Utils } from '../components/teamy/utils';

export class Inquirepassenger {
    router: Router;
    readonly: boolean;
    au: string;
    xlsx: XlsxUtils;
    xa: Array<any> = []
    xb: Array<any> = []
    static inject() { return [Router, XlsxUtils] };cd
    constructor(r,x) {
        this.router = r;
        this.xlsx = x;
    }


    activate() {
        //this.load_list();
    }
    attached() {

        var xlf = document.getElementById('file-upload');
        if (xlf.addEventListener) xlf.addEventListener('change', (e) => {
            this.handleFile(e);
        }, false);

        var xlf2 = document.getElementById('file-upload2');
        if (xlf2.addEventListener) xlf2.addEventListener('change', (e) => {
            this.handleFile2(e);
        }, false);
    }
    handleFile(e) {

        var files = e.target.files;
        var f = files[0];
        this.xa=[]
        this.xlsx.load_xlsx(f, (res: Array<any>) => {
            console.log(res);
            res.forEach((v, index) => {

                let a: any = {}
                a.id = v["公民身份号码"]
                a.name = v["姓名"]
                a.sex=v["性别"]
                a.dob=v["出生日期"]
                a.minzu=v["民族"]
                a.address=v["详址"]
                a.region=v["行政区划"]
                a.xuhao=v["序号"]
                a.found=false
                this.xa.push(a)


            })
        })
    }
    handleFile2(e) {

        var files = e.target.files;
        var f = files[0];
        this.xb=[]
        this.xlsx.load_xlsx(f, (res: Array<any>) => {
            console.log(res);
            res.forEach((v, index) => {
                if (index > 0) {
                    let a: any = {}
                    a.juedingshu = (v["违法记录"] as string).trim()
                    a.id = (v["__EMPTY_1"] as string).trim()
                    a.dangan = (v["__EMPTY_2"] as string).trim()
                    a.name = (v["__EMPTY_3"] as string).trim()
                    a.haopai_zhonglei = (v["__EMPTY_4"] as string).trim()
                    a.haopai=(v["__EMPTY_5"] as string).trim()
                    a.weifa_shijian=(v["__EMPTY_6"] as string).trim()
                    a.weifa_dizhi=(v["__EMPTY_7"] as string).trim()
                    a.weifa_xingwei=(v["__EMPTY_8"] as string).trim()
                    a.jifen=(v["__EMPTY_9"] as string).trim()
                    a.fakuan_jine=(v["__EMPTY_10"] as string).trim()
                    a.zhiqin_minjing=(v["__EMPTY_11"] as string).trim()
                    a.chuli_jiguan=(v["__EMPTY_12"] as string).trim()
                    a.jiaokuan_biaoji=(v["__EMPTY_13"] as string).trim()
                    a.jinbanren=(v["__EMPTY_14"] as string).trim()
                    a.jiluleixin=(v["__EMPTY_15"] as string).trim()
                    a.found=false
                    this.xb.push(a)
                }

            })
        })
    }
    parse_date(s: string) {
        let year = s.split(".")[0]
        let month = s.split(".")[1]
        return new Date(year + "-" + month + "-1")
    }
    do_import() {
        this.xa.forEach(a => {
            
            
            let b = this.xb.find(b => { return a.id == b.id })
            if (b) {
                console.log("Found!");
                
                a.found = b.found = true;
            }else{
                console.log("Not found");
                console.log(a);
            }

        })
    }
    remove(){
        Utils.removeFromArray(this.xa,(a)=>{return a.found})
        Utils.removeFromArray(this.xb,(b)=>{return b.found})
    }


}
