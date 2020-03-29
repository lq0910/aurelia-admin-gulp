import { customElement, bindingMode } from 'aurelia-framework';
import { bindable, observable, BindingEngine } from 'aurelia-framework';
declare var layui;
@customElement('ym-date')
export class YmDate {

    resolve: any;
    reject: any;

    is_show = true;
    data: any;
    title: string = "";
    multiple: boolean;

    @bindable
    label: string;
    selected_label: string;
    @bindable
    item_label_field: string;
    @bindable
    item_key_field: string;
    @bindable({
        changeHandler: 'value_change_handler', //name of the method to invoke when the property changes
        defaultBindingMode: bindingMode.twoWay, //default binding mode used with the .bind command
        defaultValue: undefined //default value of the property, if not bound or set in HTML
    })
    value: Date = new Date();

    @observable({ changeHandler: 'data_source_change_handler' })
    data_source: Array<any> = [];

    @bindable
    options: any;

    active: boolean;
    selected_item: any;
    selected_item_label: string = "选择。。。";
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    selected_item_key: any;

    @bindable
    change: Function;
    page_id: string;
    static inject() { return [BindingEngine]; };
    constructor(private bindingEngine) {
        let subscription = this.bindingEngine.collectionObserver(this.color)
            .subscribe(this.collectionChanged.bind(this));
        console.log(subscription);
        this.page_id = "p" + new Date().getTime();
    }
    @bindable
    @observable({ changeHandler: 'myChangeHandler' })
    color = [];

    myChangeHandler(newValue, oldValue) {
        console.log("coloe change.", newValue);

        // this will fire whenever the 'color' property changes
    }
    collectionChanged(splices) {
        console.log("数据源", splices);
        // This will fire any time the collection is modified. 
    }
    bind() {
        console.log("bind...");

    }
    attached() {

        if (this.options == null) {
            this.init();
        }
        this.init_data();
        setTimeout(() => {
            console.log("two seconds...");

            // this.data_source = ["gogog"]
            this.color = ["red"]
            console.log(this.data_source);

        }, 2000
        );
    }
    init() {
        console.log("label>>>", this.item_label_field);
        //常规用法
        // laydate.render({
        //     elem: '#ttt'
        // });
        let handle = this.selected;
        let e = "#" + this.page_id + "-date"
        let layd = layui.use('laydate', () => {
            let laydate = layui.laydate;

            //执行一个laydate实例
            laydate.render({
                elem: e,
                value: this.value,
                done: handle //指定元素

            });
        });
        console.log(layd);

    }
    selected = (value, date, endDate) => {
        console.log("日期选定", date);
        let y = Number(date.year)
        let m = Number(date.month) - 1
        let d = Number(date.date)
        this.value = new Date()
        this.value.setFullYear(y);
        this.value.setMonth(m, d);
        console.log(this.value);

    }
    init_data() {
        console.log(this.data_source);

        if (this.selected_item_key && this.item_key_field && this.data_source) {
            this.selected_item = this.data_source.find(it => { return it[this.item_key_field] == this.selected_item_key })
            if (this.selected_item) {
                this.selected_item_label = this.selected_item[this.item_label_field]
            }

        }
    }
    value_change_handler(newValue: Date, oldValue) {
        console.log("value改变");
        // let e = "#" + this.page_id + "-date"
        let t = typeof newValue;
        if (t == 'number') {
            newValue = new Date(newValue)
        }

        let y = newValue.getFullYear()
        let m = newValue.getMonth();
        let d = newValue.getDate();
        this.selected_label = y + "-" + (m + 1) + "-" + d
    }
    data_source_change_handler() {
        console.log("数据源变化");
        this.init_data();
    }
    show(opt: any = null): Promise<any> {
        this.is_show = true;
        this.data = "";
        if (opt) {
            if (opt.title) {
                this.title = opt.title;
            }
            if (opt.data) {
                this.data = opt.data;
            }
            if (opt.multiple) {
                this.multiple = opt.multiple;
            }
        }

        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        return promise
    }
    input_click() {
        this.active = true;
        document.body.addEventListener("click", this._handleDocumentClick, true)
    }
    _handleDocumentClick = (e) => {
        console.log("document click", e);
        this.active = false;
        console.log(this._handleDocumentClick);

        document.body.removeEventListener("click", this._handleDocumentClick, true)
    }
    item_click(item) {
        this.active = false;
        this.selected_item = item;
        this.selected_item_key = item[this.item_key_field];
        this.selected_item_label = item[this.item_label_field]
        if (this.change) {
            this.change(item);
        }

    }
    render_item_label(item) {
        console.log("item:", item);
        return item[this.item_key_field] + "-" + item[this.item_label_field]

    }
    confirm() {
        this.is_show = false;
        this.resolve(this.data);

    }
    cancel() {
        this.is_show = false;
        this.reject()
    }
}