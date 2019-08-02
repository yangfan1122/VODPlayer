import {U} from "./com/vod/vodplayer/view/utils/U";
/**
 * Created by yangfan on 2016/8/3.
 */
export class D {
    private static consoleDiv: HTMLElement;

    public static consolelog(params:any):void {
        try {
            console.log("%c"+params, "color:green; background-color:yellow");
        } catch (error) {
        }
    }

    public static d(params: any, replace: boolean = false): void {
        if(document.domain !== "localhost") {
            return;
        }
        if(this.consoleDiv) {
            let content: string = "<b>["+this.logTime()+"] [DEBUG]</b> "+params.toString()+"<br>";
            if(replace) {
                (this.consoleDiv as HTMLElement).innerHTML = content;
            } else {
                (this.consoleDiv as HTMLElement).innerHTML += content;
            }
        }
    }

    public static w(params: any, replace: boolean = false): void {
        if(document.domain !== "localhost") {
            return;
        }
        console.warn(params);
        if(this.consoleDiv) {
            let content: string = "<span style='color:#FC3'><b>["+this.logTime()+"] [WARN]</b> "+params.toString()+"</span><br>";
            if(replace) {
                (this.consoleDiv as HTMLElement).innerHTML = content;
            } else {
                (this.consoleDiv as HTMLElement).innerHTML += content;
            }
        } else if(!this.consoleDiv) {
            this.getConsole();
            this.w(params, replace);
        }
    }

    public static e(params: any, replace: boolean = false): void {
        console.error(params.toString());
        if(document.domain !== "localhost") {
            return;
        }
        if(this.consoleDiv) {
            let content: string = "<span style='color:#F00'><b>["+this.logTime()+"] [ERROR]</b> "+params.toString()+"</span><br>";
            if(replace) {
                (this.consoleDiv as HTMLElement).innerHTML = content;
            } else {
                (this.consoleDiv as HTMLElement).innerHTML += content;
            }
        } else if(!this.consoleDiv) {
            this.getConsole();
            this.e(params, replace);
        }
    }

    private static getConsole(): void {
        //会导致整个播放器在bowlder.js里不执行，鬼知道什么问题。
        //this.consoleDiv = U.e("vodConsole");
        //while (!this.consoleDiv) {
        //    this.consoleDiv = U.e("vodConsole");
        //}

        this.consoleDiv = document.getElementById("vodConsole") as HTMLElement;
    }

    private static logTime(): string {
        let d: Date = new Date();
        let y: string = d.getFullYear().toString();
        let m: string = (d.getMonth()+1).toString();
        if(Number(m) < 10) {
            m = "0"+m;
        }
        let day: string = d.getDate().toString();
        if(Number(day) < 10) {
            day = "0"+day;
        }
        let h: string = d.getHours().toString();
        if(Number(h) < 10) {
            h = "0"+h;
        }
        let minute: string = d.getMinutes().toString();
        if(Number(minute) < 10) {
            minute = "0"+minute;
        }
        let s: string = d.getSeconds().toString();
        if(Number(s) < 10) {
            s = "0"+s;
        }
        let ms: string = d.getMilliseconds().toString();
        if(ms.length === 1) {
            ms = "00"+ms;
        } else if(ms.length === 2) {
            ms = "0"+ms;
        }

        return y+"-"+m+"-"+day+" "+h+":"+minute+":"+s+"."+ms;
    }
}
