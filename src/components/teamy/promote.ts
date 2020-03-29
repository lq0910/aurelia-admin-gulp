
import { customElement, TaskQueue } from 'aurelia-framework';
declare var $
// declare var M;
@customElement('promote')
export class Promote {
    page_id: string;
    resolve: any;
    reject: any;
    title: string;
    label: string;
    value: any;
    task_queue;
    static inject() { return [TaskQueue]; };
    constructor(a) {
        this.task_queue = a;
    }
    attached() {
        this.page_id = "p_" + new Date().getTime().toString()
        document.onkeydown = (evt) => {

            let handled = false
            if (evt.key == "Enter") {
                let p = "#" + this.page_id + "-modal-promote"
                $(p).modal('close');
                this.confirm()
                handled = true;
            }
            if (handled) {
                evt.preventDefault()
                evt.stopPropagation();
                evt.returnValue = false;
            }
        }
    }
    activate() {
    }
    show(opt: any = null): Promise<any> {

        if (opt != null) {
            if (opt.title) {
                this.title = opt.title
            }
            if (opt.label) {
                this.label = opt.label;
            }
            if (opt.value) {
                this.value = opt.value;
            }
        }
        let p = "#" + this.page_id + "-modal-promote"
        let input = this.page_id + "-x"
        this.task_queue.queueMicroTask(() => {
            // var elems = document.querySelectorAll(p);
            // var instances = M.Modal.init(elems);
            // instances.open();
            $(p).modal();
            $(p).modal('open');
            document.getElementById(input).focus();
            (document.getElementById(input) as HTMLInputElement).select()
        })
        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        return promise
    }
    confirm() {
        this.resolve(this.value);
    }
    cancel() {
        this.reject()
    }
}