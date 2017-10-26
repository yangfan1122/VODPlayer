import {Model} from "../model/Model";
import {E} from "../E";
import {D} from "../../../../D";
import {U} from "./utils/U";
import {G} from "../../../../G";
/**
 * Created by yangfan on 2016/9/1.
 */
export class Tips {
    private model: Model;
    private container: HTMLElement;

    public constructor(m: Model) {
        this.model = m;
        this.init();
    }

    public resize(): void {
        this.errorHandler();
    }

    private init(): void {
        this.container = this.model.u.e("vodTipsContainer");
        this.model.dispatcher.addEventListener(E.STH_WRONG, this.errorHandler.bind(this));
        this.model.dispatcher.addEventListener(E.PLAYING, this.removeTips.bind(this));
    }

    private errorHandler(event: Event = null): void {
        //if(this.model.streamPlaying) {
        //    return;
        //}
        if(this.model.playing) {
            return;
        }

        let code: number = this.model.issue;
        if(code < 0) {
            return;
        }
        let content: string = "\u5176\u4ed6\u9519\u8bef\u3002";//其他错误。
        if(code === 0) {
            //抱歉，视频配置文件错误。
            content = "\u62b1\u6b49\uff0c\u89c6\u9891\u914d\u7f6e\u6587\u4ef6\u9519\u8bef\u3002";
        } else if(code === 1) {
            //很抱歉，由于版权商的要求，您所在的区域暂不能观看。
            content = "\u5f88\u62b1\u6b49\uff0c\u7531\u4e8e\u7248\u6743\u5546\u7684\u8981\u6c42\uff0c\u60a8\u6240\u5728\u7684\u533a\u57df\u6682\u4e0d\u80fd\u89c2\u770b\u3002";
        } else if(code === 2) {
            //抱歉，未找到视频文件。
            content = "\u62b1\u6b49\uff0c\u672a\u627e\u5230\u89c6\u9891\u6587\u4ef6\u3002";
        } else if(code === 3) {
            //抱歉，视频连接超时。
            content = "\u62b1\u6b49\uff0c\u89c6\u9891\u8fde\u63a5\u8d85\u65f6\u3002";
        } else if(code === 4) {
            //抱歉，视频组件加载失败。
            content = "\u62b1\u6b49\uff0c\u89c6\u9891\u7ec4\u4ef6\u52a0\u8f7d\u5931\u8d25\u3002";
        } else if(code === 5) {
            //抱歉，视频参数错误。
            content = "\u62b1\u6b49\uff0c\u89c6\u9891\u53c2\u6570\u9519\u8bef\u3002";
        } else if(code === 6) {
            //无法加载不支持的视频源
            content = "\u65e0\u6cd5\u52a0\u8f7d\u4e0d\u652f\u6301\u7684\u89c6\u9891\u6e90";
        } else if(code === 7) {
            //浏览器不支持WebGL
            content = "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u0057\u0065\u0062\u0047\u004c";
        } else if(code === 8) {
            //hls库加载失败
            content = "hls\u5e93\u52a0\u8f7d\u5931\u8d25";
        } else if(code === 9) {
            //flv库加载失败
            content = "hls\u5e93\u52a0\u8f7d\u5931\u8d25";
        } else if(code === 10) {
            //浏览器不支持，请使用Google Chrome
            content = "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\uff0c\u8bf7\u4f7f\u7528Google Chrome";
        }

        //素材尺寸1080*608
        let w: number;
        let h: number;
        if(G.stageWidth[this.model.idHeader].stageWidth/G.stageHeight[this.model.idHeader].stageHeight > 1080/608) {
            h = G.stageHeight[this.model.idHeader].stageHeight;
            w = Math.floor(1080*G.stageHeight[this.model.idHeader].stageHeight/608);
        } else {
            w = G.stageWidth[this.model.idHeader].stageWidth;
            h = Math.floor(G.stageWidth[this.model.idHeader].stageWidth*608/1080);
        }

        this.container.style.height = h + "px";
        this.container.style.top = Math.floor((G.stageHeight[this.model.idHeader].stageHeight - h)/2)+"px";

        let element: string = "<div class='vodTipsContent'>"+content+"</div><img class='vodTipsImg' width='"+w+"' height='"+h+"' src='//raw.githubusercontent.com/yangfan1122/docs/gh-pages/assets/errorbg.png' />";
        this.container.innerHTML = element;
    }

    private removeTips(event: Event): void {
        //if(this.model.streamPlaying) {
        //    this.container.innerHTML = "";
        //}
        if(this.model.playing) {
            this.container.innerHTML = "";
        }
    }
}
