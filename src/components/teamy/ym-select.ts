import { customElement, bindingMode } from 'aurelia-framework';
import { bindable, observable, BindingEngine } from 'aurelia-framework';

@customElement('ym-select')
export class YmSelect {

    resolve: any;
    reject: any;

    is_show = true;
    data: any;
    title: string = "";
    multiple: boolean;

    @bindable
    label: string;
    @bindable
    item_label_field: string;
    @bindable
    item_key_field: string;

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
    @bindable({
        changeHandler: 'value_change_handler', //name of the method to invoke when the property changes
        defaultBindingMode: bindingMode.twoWay, //default binding mode used with the .bind command
        defaultValue: undefined //default value of the property, if not bound or set in HTML
    })
    value:string;
    page_id:string;
    myChangeHandler(newValue, oldValue) {
        console.log("coloe change.", newValue);

        // this will fire whenever the 'color' property changes
    }
    collectionChanged(splices) {
        console.log("数据源", splices);
        // This will fire any time the collection is modified. 
    }
    value_change_handler(newValue, oldValue) {
        console.log("value改变",newValue);

        let n = this.data_source.find(v => {
            return v[this.item_key_field] == newValue
        })
        if (n) {
            this.selected_item = n;
            this.selected_item_label = this.selected_item[this.item_label_field]
        }
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
        this.active = false;
        
        document.body.removeEventListener("click", this._handleDocumentClick,true)
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
        return  item[this.item_label_field]
        // return item[this.item_key_field] + "-" + item[this.item_label_field]
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