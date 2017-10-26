import {G} from "../../../../../G";
import {Model} from "../../model/Model";
/**
 * Created by yangfan on 2016/9/8.
 */
export class Stat {
    // private static stat: Stat = new Stat();
    private img: HTMLImageElement;
    private statUrl: string = "http://yourstatdomain/htdata/";
    private uuid: string;
    private channel: string = "vodplayer";
    private model:Model;

    public constructor(m:Model) {
        this.uuid = this.generateUuid();
        this.model = m;
    }

    // public static get instance(): Stat {
    //     return this.stat;
    // }

    /**
     * 缓冲
     * @param time
     * @param qt
     */
    public buffer(time: number, qt: string): void {
        this.statData({
            act : 1,
            ontime : Math.floor(time),
            qt: qt,
        });
    }

    /**
     * 心跳
     * @param time
     * @param qt
     */
    public heartbeat(time: number, qt: string): void {
        this.statData({
            act : 0,
            ontime : Math.floor(time),
            qt: qt,
        });
    }

    /**
     * 失败
     * @param failurl
     * @param qt
     */
    public videoFailed(failurl: string, qt: string): void {
        this.statData({
            failtype : 0,
            failurl : failurl,
            qt: qt,
        });
    };

    /**
     * 播放开始
     * @param successurl
     * @param bf
     * @param qt
     */
    public playStart(successurl: string, bf: number, qt: string): void {
        this.statData({
            bftime: bf,
            qt: qt,
            successtype: 0,
            successurl: successurl,
        });
    };

    /**
     * 播放完成
     * @param qt
     */
    public playComplete(qt: string): void {
        this.statData({
            act: 4,
            qt: qt,
        });
    };

    private statData(data: any): void {
        data.uuid = this.uuid;
        data.channel = this.channel;
        data.vid = G.params[this.model.idHeader].vid || "";
        data.sid = G.params[this.model.idHeader].sid || "";
        data.pltype = G.params[this.model.idHeader].pltype || "";
        data.topicid = G.params[this.model.idHeader].topicid || "";
        data.qt = data.qt?data.qt:"";
        data.r = (new Date()).getTime();
        if(G.params[this.model.idHeader].stat === "1") {
            this.send(data);
        }
    }
    private send(data: any): void {
        if(this.img === undefined) {
            this.img = document.createElement("img");
            this.img.style.display = "none";
            document.body.appendChild(this.img);
        }
        let param: string = "";
        for(let key in data) {
            if(data.hasOwnProperty(key)) {//不检查TSLint会在for(...in...)行报错
                param += (param === "") ? "?" : "&";
                param += key + "=" + data[key];
            }
        }
        this.img.src = this.statUrl + param;
    }
    private generateUuid(): string {
        let ran: number;
        let num: number;
        let code: string = "";
        let checkCode: string = "";
        for (let i: number = 0; i < 6; i++) {
            ran = Math.random();
            num = Math.round(ran * 1000);
            if (num % 2 === 0) {
                code = String.fromCharCode(48 + (num % 10));
            } else {
                code = String.fromCharCode(65 + (num % 26));
            }
            checkCode += code;
        }
        return (new Date()).getTime() + checkCode;
    }
}
