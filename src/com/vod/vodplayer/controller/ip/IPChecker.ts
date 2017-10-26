import {E} from "../../E";
import {LoadJSON} from "../utils/LoadJSON";
import {G} from "../../../../../G";
import {U} from "../../view/utils/U";
import {D} from "../../../../../D";
import {Timer} from "../utils/Timer";
import {Utils} from "../utils/Utils";
import {Model} from "../../model/Model";
/**
 * Created by yangfan on 2016/8/8.
 */
export class IPChecker extends E{
    private loadJSON: LoadJSON = new LoadJSON();
    private timer: Timer;

    public check(m:Model): void {
        if(G.params[m.idHeader].iplimit === "1") {
            this.timer = new Timer(this.timeout.bind(this), 1000);
            this.timer.start();

            this.loadJSON.dispatcher.addEventListener(E.IP_LOADED, this.checkipHandler.bind(this));
            this.loadJSON.dispatcher.addEventListener(E.IP_FAILED, this.checkipHandler.bind(this));
            if(Utils.isLocal()) {
                this.loadJSON.load("isFromMainland", E.IP_LOADED, E.IP_FAILED);
            } else {
                this.loadJSON.load("//ipservice.163.com/isFromMainland", E.IP_LOADED, E.IP_FAILED);
            }
        } else {
            this.dispatch(E.IP_ALLOWED);
        }
    }

    private checkipHandler(event: Event): void {
        this.loadJSON.dispatcher.removeEventListener(E.IP_LOADED, this.checkipHandler.bind(this));
        this.loadJSON.dispatcher.removeEventListener(E.IP_FAILED, this.checkipHandler.bind(this));
        this.timer.stop();

        if(event.type === E.IP_LOADED) {
            if(this.loadJSON.data.toString() === "true") {
                this.dispatch(E.IP_ALLOWED);
            } else {
                this.dispatch(E.IP_FORBIDDEN);
            }
        } else if(event.type === E.IP_FAILED) {
            this.dispatch(E.IP_ALLOWED);
        }
    }

    private timeout(): void {
        this.timer.stop();
        this.loadJSON.dispatcher.removeEventListener(E.IP_LOADED, this.checkipHandler.bind(this));
        this.loadJSON.dispatcher.removeEventListener(E.IP_FAILED, this.checkipHandler.bind(this));
        this.dispatch(E.IP_ALLOWED);
    }
}