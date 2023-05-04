import {D} from "../../../../../D";
/**
 * Created by yangfan on 2016/8/8.
 */
export class Timer {
    private callback: Function;
    private timer: number;
    private time: number = null;
    private counter: number = 0;
    private __nativeST__:any;

    public constructor(callback: Function, time: number) {
        this.callback = callback;
        this.time = time;

        // this.__nativeST__ = window.setTimeout;
        // let that:Timer = this;
        // window.setTimeout = function (vCallback:Function, nDelay:number /*, argumentToPass1, argumentToPass2, etc. */) {
        //     let oThis:Timer = that, aArgs:any[] = Array.prototype.slice.call(arguments, 2);
        //     //call, this(window)本身没有__nativeST__方法，借用oThis(Timer)的方法使用。
        //     return oThis.__nativeST__.call(this, vCallback instanceof Function ? function () {
        //         vCallback.apply(oThis, aArgs);
        //     } : vCallback, nDelay);
        // };
    }

    public start(): void {
        // window.setTimeout(this.intervalHandler, this.time);
        this.timer = window.setInterval(this.timerHandler.bind(this), this.time);
    }
    // private intervalHandler():void {
    //     this.timerHandler();
    //     this.timer = window.setTimeout(this.intervalHandler, this.time);
    // }

    public stop(): void {
        // window.clearTimeout(this.timer);
        clearInterval(this.timer);
        this.counter = 0;
        this.timer = null;
    }

    public get running(): boolean {
        return this.timer!==undefined;
    }

    public get delay(): number {
        return this.time;
    }

    public get currentCount():number {
        return this.counter;
    }

    public get getTimer():number {
        return this.timer;
    }

    private timerHandler():void {
        this.counter++;
        this.callback();
    }
}