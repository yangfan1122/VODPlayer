import {E} from "../../E";
import {D} from "../../../../../D";
/**
 * Created by yangfan on 2016/8/5.
 */
export class LoadJSON extends E {
    private xmlhttp: XMLHttpRequest = new XMLHttpRequest();
    private successEvent: string;
    private failEvent: string;
    private json: JSON;
    private READY_STATE_CHANGE: string = "readystatechange";

    public setVideoJSON(src: string): void {
        this.json = JSON.parse('{"all":{"flvUrl":{"flv":["'+src+'","'+src+'"]},"title":"","totaltime":"","tags":"","pltype":"","stree":"","pageUrl":""}}');
    }

    public load(url: string, successEvent: string, failEvent: string): void {
        this.successEvent = successEvent;
        this.failEvent = failEvent;

        this.xmlhttp.addEventListener(this.READY_STATE_CHANGE,this.stateChange.bind(this));
        this.xmlhttp.open("GET", url, true);
        this.xmlhttp.send();
    }

    private stateChange(event: Event): void {
        if (this.xmlhttp.readyState === 4 && this.xmlhttp.status === 200) {
            this.xmlhttp.removeEventListener(this.READY_STATE_CHANGE,this.stateChange.bind(this));
            try {
                this.json = JSON.parse(this.xmlhttp.responseText);
                this.dispatch(this.successEvent);
            } catch (error) {
                this.dispatch(this.failEvent);
            }
        } else if(this.xmlhttp.readyState === 4 && this.xmlhttp.status !== 200) {
            this.xmlhttp.removeEventListener(this.READY_STATE_CHANGE,this.stateChange.bind(this));
            this.dispatch(this.failEvent);
        }
    }

    public get data(): any {
        return this.json;
    }
}
