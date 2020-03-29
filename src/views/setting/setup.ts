import { Router } from 'aurelia-router';
import { Utils } from '../../components/teamy/utils';

export class Setups {
    router: Router;
    readonly: boolean;
    au: string;
    xa: Array<any> = []
    xb: Array<any> = []
    static inject() { return [Router] };
    constructor(r: Router) {
        this.router = r;
    }

    activate() {
    }
    attached() {
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
