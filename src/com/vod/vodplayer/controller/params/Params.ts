import {D} from "../../../../../D";
import {G} from "../../../../../G";
/**
 * Created by yangfan on 2016/8/4.
 */
export class Params {
    public static init(params: any, idheader:string): void {
        G.params[idheader] = {};

        G.params[idheader].topicid = this.isNumber(params.topicid?params.topicid:"");
        G.params[idheader].pltype = this.isNumber(params.pltype?params.pltype:"");
        G.params[idheader].vid = this.isNumberAndLetter(params.vid?params.vid:"");
        G.params[idheader].sid = this.isNumberAndLetter(params.sid?params.sid:"");
        G.params[idheader].iplimit = this.isNumber(params.iplimit?params.iplimit:"");
        G.params[idheader].loop = this.isNumber(params.loop?params.loop:"");
        G.params[idheader].vr = this.isNumber(params.vr?params.vr:"0");
        G.params[idheader].stat = this.isNumber(params.stat?params.stat:"0");
        G.params[idheader].muted = this.isNumber(params.muted?params.muted:"");
        if(params.control === 0 || params.control === "0") {
            G.params[idheader].control = "0";
        } else {
            G.params[idheader].control = "1";
        }
        G.params[idheader].coverpic = params.coverpic?params.coverpic:"";
        G.params[idheader].autoplay = params.autoplay?params.autoplay:false;
        G.params[idheader].videoadv = params.videoadv?params.videoadv:"";
        G.params[idheader].videoSource = params.videoSource?params.videoSource:"";
        G.params[idheader].focusJson = params.focusJson?params.focusJson:"";//看点json数据
        G.params[idheader].check = this.isNumber(params.check?params.check:"0");//审核平台版
        G.params[idheader].playbackrate = this.isNumber(params.playbackrate?params.playbackrate:"");//默认倍速，check为1时有效
        G.params[idheader].starttime = this.isNumber(params.starttime?params.starttime:"0");//默认开始时间，autoplay为false时有效
        G.params[idheader].endtime = this.isNumber(params.endtime?params.endtime:"0");//默认结束时间，autoplay为false时有效
        if(Number(G.params[idheader].starttime) > Number(G.params[idheader].endtime)) {
            G.params[idheader].endtime = Infinity;
        }
    }

    private static isNumber(num: string): string {
        let reg: RegExp = new RegExp("^[0-9]*$");
        if(reg.test(num)) {
            return String(num);//确保转译后的js里能返回string类型
        } else {
            return "";
        }
    }
    private static isNumberAndLetter(str: string): string {
        let reg: RegExp = new RegExp("^[A-Za-z0-9]+$");
        if(reg.test(str)) {
            return String(str);
        } else {
            return "";
        }
    }
}
