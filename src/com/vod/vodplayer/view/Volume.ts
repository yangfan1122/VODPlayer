import {Model} from "../model/Model";
import {E} from "../E";
import {D} from "../../../../D";
import {G} from "../../../../G";
import {U} from "./utils/U";
import {Controller} from "../controller/Controller";
/**
 * Created by yangfan on 2016/8/13.
 */
export class Volume {
    private model: Model;
    private controller: Controller;
    private volumeBtn: HTMLElement;
    private volume: number;
    private preVolume: number = 0;
    private barWidth: number;
    private oldX: number;
    private oldWidth: number = 0;
    private tempMouseHandler: any;
    private tempSliderHandler: any;
    private sliderWidth: number;

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;
        this.init();
    }

    private init(): void {
        this.volumeBtn = this.model.u.e("vodVolumeBtn");
        this.barWidth = this.model.u.e("vodVolumeBar").clientWidth;
        this.sliderWidth = this.model.u.e("vodVolumeSlider").clientWidth;

        this.model.u.e("vodVolumeBtnContainer").addEventListener("mouseenter", this.mouseEnterHandler.bind(this));//this.volumeBtn
        this.model.u.e("vodVolumeBtnContainer").addEventListener("mouseleave", this.mouseLeaveHandler.bind(this));
        this.model.u.e("vodVolumeBar").addEventListener("mouseenter", this.mouseEnterHandler.bind(this));
        this.model.u.e("vodVolumeBar").addEventListener("mouseleave", this.mouseLeaveHandler.bind(this));

        this.model.dispatcher.addEventListener(E.TIME_UPDATE, this.timeupdate.bind(this));
        this.volumeBtn.addEventListener("click", this.btnHandler.bind(this));
        this.model.dispatcher.addEventListener(E.VOLUME_CHANGE, this.volumeChanged.bind(this));

        this.tempMouseHandler = this.clickHandler.bind(this);
        this.model.u.e("vodVolumeBars").addEventListener("click", this.tempMouseHandler);
        this.model.u.e("vodVolumeSlider").addEventListener("mousedown", this.sliderHandler.bind(this));

        this.hideBar();
    }

    /**
     * 音量变化
     * @param event
     */
    private volumeChanged(event: Event): void {
        this.volume = this.model.volume;
        this.btnStyle();
    }

    /**
     * 音量按钮
     * @param event
     */
    private btnHandler(event: MouseEvent): void {
        if(this.volume!==0) {
            this.preVolume = this.volume;
            this.volume = 0;
        } else if(isNaN(this.preVolume)) {
            return;
        } else {
            this.volume = this.preVolume;
        }

        this.model.u.width("vodVolumeMoving", this.barWidth*this.volume);
        let left: number = this.barWidth*this.volume-Math.ceil(this.sliderWidth/2);
        if(left<0) {
            left = 0;
        }
        this.model.u.e("vodVolumeSlider").style.left = left+"px";
        this.controller.volume(this.volume);
    }

    private btnStyle(): void {
        if(this.volume === 0) {
            this.model.u.e("vodVolumeBtn").className = "vodVolumeBtnMuted";
        } else if(this.volume < 0.5) {
            this.model.u.e("vodVolumeBtn").className = "vodVolumeBtnHalf";
        } else {
            this.model.u.e("vodVolumeBtn").className = "vodVolumeBtnFull";
        }

        this.model.u.width("vodVolumeMoving", this.barWidth*this.volume);
        let left: number = this.barWidth*this.volume;
        if(left<0) {
            left = 0;
        }
        if(left>this.barWidth-this.sliderWidth) {
            left = this.barWidth-this.sliderWidth;
        }
        this.model.u.e("vodVolumeSlider").style.left = left+"px";
    }

    /**
     * 点击音量条
     * @param event
     */
    private clickHandler(event: MouseEvent): void {
        let pct: number = event.offsetX / this.barWidth;
        this.controller.volume(pct);

        this.model.u.width("vodVolumeMoving", this.barWidth*pct);
        let left: number = this.barWidth*this.volume-Math.ceil(this.sliderWidth/2);
        if(left<0) {
            left = 0;
        }
        this.model.u.e("vodVolumeSlider").style.left = left+"px";
    }

    /**
     * 滑块
     * @param event
     */
    private sliderHandler(event: MouseEvent): void {
        if(event.type === "mousedown") {
            document.body.onselectstart = this.selectHandler.bind(this);
            this.model.u.e("vodVolumeBar").removeEventListener("click", this.tempMouseHandler);

            this.tempSliderHandler = this.sliderHandler.bind(this);
            window.document.addEventListener("mouseup", this.tempSliderHandler);
            window.document.addEventListener("mousemove", this.tempSliderHandler);

            this.oldX = event.pageX || event.clientX || event.offsetX;
            this.oldWidth = this.model.u.e("vodVolumeMoving").clientWidth;
        } else if(event.type === "mouseup") {
            document.body.onselectstart = null;
            window.document.removeEventListener("mouseup", this.tempSliderHandler);
            window.document.removeEventListener("mousemove", this.tempSliderHandler);
            this.model.u.e("vodVolumeBars").addEventListener("click", this.tempMouseHandler);

            let pct: number = Math.ceil(this.model.u.e("vodVolumeMoving").clientWidth/(this.barWidth-this.sliderWidth)*10)/10;
            this.controller.volume(pct);
        } else if(event.type === "mousemove") {
            let tempX: number;
            if (event.pageX == null && event.clientX != null) {
                let doc: any = document.documentElement;
                let body: any = document.body;
                tempX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            } else {
                tempX = event.pageX;
            }
            let w: number = tempX - this.oldX;
            let nowWidth: number = this.oldWidth + w;
            if(nowWidth > this.barWidth-this.sliderWidth) {
                nowWidth = this.barWidth-this.sliderWidth;
            }
            if(nowWidth < 0) {
                nowWidth = 0;
            }
            this.model.u.width("vodVolumeMoving", nowWidth);
            this.model.u.e("vodVolumeSlider").style.left = (nowWidth)+"px";
        }
    }

    /**
     * 禁选文本
     * @param event
     * @returns {boolean}
     */
    private selectHandler(event: Event): boolean {
        return false;
    }

    /**
     * 时间框
     * @param event
     */
    private timeupdate(event: Event): void {
        let now: string = this.model.u.formatTime(this.model.timeupdate*G.movieInfo[this.model.idHeader].duration);
        let total: string = this.model.u.formatTime(G.movieInfo[this.model.idHeader].duration);
        this.model.u.e("vodTime").innerHTML = now+" / "+total;
    }

    /**
     * 移出
     * @param event
     */
    private mouseLeaveHandler(event: MouseEvent): void {
        //this.model.u.css("vodVolumeBar", "vodVolumeBar");

        this.hideBar();
    }

    /**
     * 移入
     * @param event
     */
    private mouseEnterHandler(event: MouseEvent): void {
        //this.model.u.css("vodVolumeBar", "vodVolumeBar vodVolumeBarHover");

        this.showBar();
    }

    private hideBar(): void {
        this.model.u.e("vodVolumeSlider").style.display = "none";
        this.model.u.e("vodVolumeBars").style.display = "none";
        this.model.u.e("vodTime").style.left = "0px";
    }
    private showBar(): void {
        this.model.u.e("vodVolumeSlider").style.display = "block";
        this.model.u.e("vodVolumeBars").style.display = "block";
        this.model.u.e("vodTime").style.left = "60px";
    }
}
