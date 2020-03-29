
import { customElement, TaskQueue } from 'aurelia-framework';
import * as weui from '../../../node_modules/weui.js/dist/weui.min.js'

@customElement('confirm')
export class Confirm {
    page_id: string;
    resolve: any;
    reject: any;

    task_queue;
    static inject() { return [TaskQueue]; };
    constructor(a) {
        this.task_queue = a;
    }
    attached() {

    }

    show(opt: any = null): Promise<any> {
        weui.confirm('确认删除这条信息吗？', () => {

            this.resolve();
        },
            () => {
                this.reject()
            });

        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        return promise
    }

}