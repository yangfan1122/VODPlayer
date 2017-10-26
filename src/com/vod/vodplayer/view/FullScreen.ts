import {D} from "../../../../D";
import {Controller} from "../controller/Controller";
import {Model} from "../model/Model";
import {U} from "./utils/U";
/**
 * Created by yangfan on 2016/8/30.
 */
export class FullScreen {
    private model: Model;
    private controller: Controller;
    private btn: HTMLElement;//控制栏按钮
    private stage: HTMLElement;

    public constructor(m: Model, c: Controller, stage: HTMLElement) {
        this.model = m;
        this.controller = c;
        this.stage = stage;

        this.init();
    }

    private init(): void {
        this.btn = this.model.u.e("vodFullBtn");
        this.btn.addEventListener("click", this.clickHandler.bind(this));

        document.addEventListener("fullscreenchange", this.resize.bind(this));
        document.addEventListener("webkitfullscreenchange", this.resize.bind(this));
        document.addEventListener("mozfullscreenchange", this.resize.bind(this));
        document.addEventListener("MSFullscreenChange", this.resize.bind(this));
    }

    private clickHandler(event: MouseEvent): void {
        if(this.btn.className === "vodFull vodFullBtn") {
            this.launchFullscreen(this.stage);
        } else if(this.btn.className === "vodFull vodExitFullBtn") {
            this.exitFullscreen();
        }
    }

    private resize(event: Event): void {
        let doc: any = document;
        let fullscreenElement: HTMLElement =
            doc.fullscreenElement ||
            doc.mozFullScreenElement ||
            doc.webkitFullscreenElement ||
            doc.msFullscreenElement;

        if(fullscreenElement) {
            this.btn.className = "vodFull vodExitFullBtn";
        } else {
            this.btn.className = "vodFull vodFullBtn";
        }
    }

    /**
     * 全屏
     * @param element
     */
    private launchFullscreen(element: any): void {
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen();
        } else {
            //您的浏览器不支持全屏模式。
            this.model.alertWindow = "\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u5168\u5c4f\u6a21\u5f0f\u3002";
        }
    }

    /**
     * 退出全屏
     */
    private exitFullscreen(): void {
        let element: any = document;
        if (element.exitFullscreen) {
            element.exitFullscreen();
        } else if (element.msExitFullscreen) {
            element.msExitFullscreen();
        } else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            element.webkitExitFullscreen();
        }
    }
}
