declare var fetch
declare var $
declare var window
export class PopUpEvent {
    static EventType_Close = "PopUpCloseEvent";
    data: any;
    hasData: Boolean;
    yesOrNo: Boolean;//是或否
    cancel: Boolean;//点击关闭按钮或取消按钮
}
export class HttpJsonClient {
    auth_faild:any;
    private get_options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
        },
        credentials: 'include'
    }
    http_get(url): Promise<any> {
        return fetch(url, this.get_options).then(
            (response: Response) => {
                if (response.ok) {
                    console.log("HTTP GET SUCCESS:")
                    return response.json().then(
                        (res) => {
                            return res;
                        }
                    ).catch(() => {
                        Promise.resolve(null)
                    })
                } else if (response.status == 401) {
                    if(this.auth_faild){
                        this.auth_faild(url)
                    }
                    Promise.reject(403)
                } else if (response.status == 200) {
                    console.log("正确返回");

                    Promise.resolve(null)
                } else {
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }
            });
    }
    http_post(url: string, body): Promise<OperationStatus> {
        return this.do_http_post(url, body)
    }
    http_search(url: string, body): Promise<any> {
        return this.do_http_post(url, body)
    }
    http_post_form(url: string, formData): Promise<OperationStatus> {
        var form_options = {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json'
                //不能加ContentType，否则出现错误 Missing boundary in multipart/form-data POST
            },
            credentials: 'include',
            body: formData
        }
        return fetch(url, form_options).then(
            (response: Response) => {
                if (response.ok) {
                    console.log("HTTP POST SUCCESS:")
                    return response.json()

                } else if (response.status == 403) {
                    Promise.reject("权限不够或登陆超时！")
                } else if(response.status==0){
                    console.log("文件上传总是0");
                    Promise.resolve()
                    //return response.json()
                }else{
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }

            });
    }
    private do_http_post(url: string, body): Promise<any> {
        let b;
        if ((typeof body) == "string") {
            b = body;
        } else {
            b = JSON.stringify(body)
        }
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            },
            credentials: 'include',
            body: b
        }
        return fetch(url, options).then(
            (response: Response) => {
                if (response.ok) {
                    console.log("HTTP POST SUCCESS:")
                    return response.json()

                } else if (response.status == 403) {
                    Promise.reject("权限不够或登陆超时！")
                } else {
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }

            });
    }
}
export class Counter {
    is_counting: boolean = false;
    count: number = 0;
    private timer: any;
    start(seconds: number) {
        console.log("count from:" + seconds);

        this.count = seconds;
        this.is_counting = true;
        this.timer = setInterval(this.handler, 1000)
    }
    private handler = () => {
        console.log("counting..." + this.count);

        if (this.count > 0) {
            this.count -= 1;
        } else {
            clearInterval(this.timer)
            this.count = 0
            this.is_counting = false
        }
    }
}


export class OperationStatus {
    ok: boolean;
    msg: string;
    handled: boolean;
    payload: any;
}

export class DateUtils {
    static getMonday(d: Date) {

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));

    }
    static getFirstDayOfMonth(date: Date) {

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay;
    }
        static format_with_dash(date: Date): string {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        return [date.getFullYear(),"-",
        (mm > 9 ? '' : '0') + mm,"-",
        (dd > 9 ? '' : '0') + dd
        ].join('');
    }
    static addDays(date: Date, days: number) {
        let dat = new Date(date.valueOf());
        dat.setDate(dat.getDate() + days);

        return dat;
    }

}
export class Utils {

    private static _cache: Map<string, any> = new Map<string, any>();
    public static get Cache() {
        return Utils._cache;
    }
    /**
     * 拷贝对象
     * @param a 源对象
     * @param b 目标对象
     */
    static copy_object(a, b) {

        for (var prop in a) {
            b[prop] = a[prop];
        }
        return b;
    }
    static removeArrayItem(arr: Array<any>, item: any) {
        let index = arr.indexOf(item)
        if (index >= 0) {
            arr.splice(index, 1)
        }
    }
    static removeFromArray(arr: Array<any>, func: any) {
        let item: Array<any> = arr.filter(func)
        if (item.length > 0) {
            item.forEach(
                v => {
                    let index = arr.indexOf(v)
                    console.log(index);

                    if (index >= 0) {
                        arr.splice(index, 1)
                    }
                }
            )

        }


    }
    /**
     * 
     * @param el CSS选择器
     */
    static triger_change(el: string) {
        $(el).on('change', (event: any) => {
            let changeEvent;
            // console.log("change event...",event);
            if (event.originalEvent) { return; }
            // console.log("change event on original...",event);
            if (window.CustomEvent) {
                changeEvent = new CustomEvent('change', {
                    detail: {
                        value: event.target.value
                    },
                    bubbles: true
                });
            } else {
                changeEvent = document.createEvent('CustomEvent');
                changeEvent.initCustomEvent('change', true, true, {
                    detail: {
                        value: event.target.value
                    }
                });
            }
            event.target.dispatchEvent(changeEvent);
        });
    }
    static upDigit(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);

        var s = '';

        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
    static format_date(d: number) {

        var newdate = new Date(d)
        return newdate.toLocaleDateString("zh-CN");
    }

    /**支持单个对象或对象数组的替换
    /* {}
    /*/
    static replace(str: string, obj: any): string {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {

            var ret;
            if (Utils.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var v = obj[i][key];
                    if (v !== undefined) {
                        //check null.
                        if (v != null) {
                            ret = '' + v;
                        } else {
                            ret = '';
                        }


                        break;
                    } else {
                        ret = '{' + key + '}';
                    }
                }
            } else {
                var v2 = obj[key];
                ret = (v2 !== undefined) ? '' + v2 : '{' + key + '}';
            }

            return ret;
        });
    }

    static toMoneyString(money: number) {
        return '¥' + money.toFixed(2);
    }
    static replaceOne(str: string, obj: any): string {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {
            var value = obj[key];
            console.log(key);
            return (value !== undefined) ? '' + value : '{' + key + '}';
        });
    }
    static urlToObject(): any {
        var url: string = window.location.toString();
        var paramsString: string = url.substring(url.indexOf("?") + 1, url.length);
        return Utils.queryToObject(paramsString);
    }
    static queryToObject(/*String*/ str: string): any {
        // summary:
        //		Create an object representing a de-serialized query section of a
        //		URL. Query keys with multiple values are returned in an array.
        //
        // example:
        //		This string:
        //
        //	|		"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
        //
        //		results in this object structure:
        //
        //	|		{
        //	|			foo: [ "bar", "baz" ],
        //	|			thinger: " spaces =blah",
        //	|			zonk: "blarg"
        //	|		}
        //
        //		Note that spaces and other urlencoded entities are correctly
        //		handled.

        // FIXME: should we grab the URL string if we're not passed one?
        var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
        for (var i = 0, l = qp.length, item; i < l; ++i) {
            item = qp[i];
            if (item.length) {
                var s = item.indexOf("=");
                if (s < 0) {
                    name = dec(item);
                    val = "";
                } else {
                    name = dec(item.slice(0, s));
                    val = dec(item.slice(s + 1));
                }
                if (typeof ret[name] == "string") { // inline'd type check

                    ret[name] = [ret[name]];
                }

                if (this.isArray(ret[name])) {
                    ret[name].push(val);
                } else {

                    if (val == "true") {
                        val = true;
                    } else if (val == "false") {
                        val = false;
                    }
                    ret[name] = val;
                }
            }
        }
        return ret;
    }
    static isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }
    // static fix_input() {
    //     var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'
    //     setTimeout(() => {
    //         // $(input_selector).change();
    //         $(input_selector).each(function (index, element) {
    //             if ($(element).val().length > 0 || element.autofocus || $(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
    //                 $(this).siblings('label').addClass('active');
    //             }
    //             else {
    //                 $(this).siblings('label').removeClass('active');
    //             }
    //         });
    //     }, 100)
    // }

}
