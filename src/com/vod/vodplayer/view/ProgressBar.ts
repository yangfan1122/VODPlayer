import {D} from "../../../../D";
import {G} from "../../../../G";
import {E} from "../E";
import {Model} from "../model/Model";
import {U} from "./utils/U";
import {Controller} from "../controller/Controller";
import {View} from "./View";

/**
 * Created by yangfan on 2016/8/2.
 */
export class ProgressBar {
    private model: Model;
    private controller: Controller;
    private barWidth: number;
    private oldX: number;
    private oldY: number;
    private tempSliderHandler: any;
    private tempTimeupdateHandler: any;
    private tempMouseHandler: any;
    private tempBarsHandler: any;
    private clickListenerRemoved: boolean = false;
    private focusPanel: HTMLElement;
    private focusArr: any[] = [];
    private focusContainer: HTMLElement;
    private tempDurationHandler: any;

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;
        this.init();
    }

    public resize(): void {
        this.barWidth = G.stageWidth[this.model.idHeader].stageWidth - 20;
        this.model.u.width("vodProgressBar", this.barWidth);
        this.model.u.width("vodLoadingBar", this.barWidth*this.model.progress);
        this.model.u.width("vodPlayingBar", this.barWidth*this.model.timeupdate);
        this.model.u.x("vodSlider", this.barWidth*this.model.timeupdate-8);

        //看点
        this.focus();
    }

    private init(): void {
        this.tempTimeupdateHandler = this.timeupdate.bind(this);
        this.model.dispatcher.addEventListener(E.TIME_UPDATE, this.tempTimeupdateHandler);

        this.tempBarsHandler = this.mouseHandler.bind(this);
        this.model.u.e("vodProgressBar").addEventListener("mouseenter", this.tempBarsHandler);
        this.model.u.e("vodProgressBar").addEventListener("mouseleave", this.tempBarsHandler);

        this.tempMouseHandler = this.mouseHandler.bind(this);
        this.model.u.e("vodProgressBar").addEventListener("click", this.tempMouseHandler);

        this.model.u.e("vodSlider").addEventListener("mousedown", this.sliderHandler.bind(this));//临时关闭
        this.model.dispatcher.addEventListener(E.PROGRESS, this.progress.bind(this));
        this.model.dispatcher.addEventListener(E.SEEKED, this.seekedHandler.bind(this));

        this.tempDurationHandler = this.durationHandler.bind(this);
        this.model.dispatcher.addEventListener(E.DURATION_CHANGE, this.tempDurationHandler);
    }

    private durationHandler(event?: Event): void {
        this.model.dispatcher.removeEventListener(E.DURATION_CHANGE, this.tempDurationHandler);
        this.focus();
    }

    /**
     * 看点初始化
     */
    private focus(): void {
        this.focusPanel = this.model.u.e("vodFocusPanel");
        this.model.u.display(this.focusPanel, "none");
        this.focusContainer = this.model.u.e("vodFocusBarContainer");

        if(G.params[this.model.idHeader].focusJson.length === 0) {
            return;
        }
        try {
            this.focusArr = JSON.parse(G.params[this.model.idHeader].focusJson);
        } catch (error) {
            D.e("focusJson, "+error);
            return;
        }
        let pointArr: any[] = [];
        let duration: number = Math.floor(this.model.duration);
        if(duration === 0) {
            return;
        }
        for(let i: number = 0; i<this.focusArr.length; i++) {
            let item: any = {};
            item.start = Number(this.focusArr[i].startPoint);
            item.end = Number(this.focusArr[i].endPoint);
            if(item.start > duration) {
                break;
            } else if(item.end > duration) {
                item.end = duration;
            }
            item.width = ((item.end - item.start)/duration) * this.barWidth;
            if(item.width < 4) {
                item.width = 4;
            }
            item.startPCT = item.start / duration;
            item.cutImage = this.focusArr[i].cutImage;
            item.title = this.focusArr[i].title;
            item.id = this.focusArr[i].id;
            pointArr.push(item);
        }

        this.focusContainer.innerHTML = "";
        for(let j: number = 0; j<pointArr.length; j++) {
            let node: HTMLElement = document.createElement("div");//进度条上的看点条
            (node.dataset as any).id = pointArr[j].id;
            (node.dataset as any).title = pointArr[j].title;
            (node.dataset as any).cutimage = pointArr[j].cutImage;
            (node.dataset as any).start = pointArr[j].start;
            this.model.u.width(node, pointArr[j].width);
            this.model.u.x(node, pointArr[j].startPCT*this.barWidth);
            this.focusContainer.appendChild(node);

            node.onmouseover = this.mover.bind(this);
            node.onmouseout = this.mout.bind(this);
            node.onclick = this.mclick.bind(this);
        }
    }

    /**
     * 播放进度
     * @param event
     */
    private timeupdate(event: Event): void {
        this.model.u.width("vodPlayingBar", (G.stageWidth[this.model.idHeader].stageWidth - 20)*this.model.timeupdate);
        this.model.u.x("vodSlider", (G.stageWidth[this.model.idHeader].stageWidth - 20)*this.model.timeupdate-8);
    }

    /**
     * 加载进度
     * @param event
     */
    private progress(event: Event): void {
        this.model.u.width("vodLoadingBar", Math.floor(this.model.progress*(G.stageWidth[this.model.idHeader].stageWidth - 20)));
    }

    /**
     * 进度条鼠标事件
     * @param event
     */
    private mouseHandler(event: MouseEvent): void {
        if(event.type === "mouseenter") {
            this.model.u.e("vodBars").className = "vodBars vodBarsHover";
            this.model.u.e("vodSlider").className = "vodSlider vodSliderShow";
        } else if(event.type === "mouseleave") {
            this.model.u.e("vodBars").className = "vodBars";
            this.model.u.e("vodSlider").className = "vodSlider";
        } else if(event.type === "click") {
            let pct: number = event.offsetX / this.barWidth;
            this.controller.seek(pct);
        }
    }

    /**
     * 滑块鼠标事件
     * @param event
     */
    private sliderHandler(event: MouseEvent): void {
        if(event.type === "mousedown") {
            try {
                window.getSelection().removeAllRanges();
            } catch (error) {
                D.e("ProgressBar slider, "+error);
            }

            document.body.onselectstart = this.selectHandler.bind(this);
            this.model.dispatcher.removeEventListener(E.TIME_UPDATE, this.tempTimeupdateHandler);
            this.model.u.e("vodProgressBar").removeEventListener("click", this.tempMouseHandler);
            this.clickListenerRemoved = true;

            this.tempSliderHandler = this.sliderHandler.bind(this);
            window.document.addEventListener("mouseup", this.tempSliderHandler);
            window.document.addEventListener("mousemove", this.tempSliderHandler);

            this.oldX = event.layerX || event.offsetX;
            this.oldY = event.layerY || event.offsetY;
        } else if(event.type === "mouseup") {
            document.body.onselectstart = null;
            window.document.removeEventListener("mouseup", this.tempSliderHandler);
            window.document.removeEventListener("mousemove", this.tempSliderHandler);
            this.model.dispatcher.addEventListener(E.TIME_UPDATE, this.tempTimeupdateHandler);

            let pct: number = Number(this.model.u.e("vodPlayingBar").style.width.split("px")[0])/this.barWidth;
            this.controller.seek(pct);
        } else if(event.type === "mousemove") {
            if(event.target !== this.model.u.e("vodSlider")) {
                let w: number = event.offsetX;
                if(w<0) {
                    w = 0;
                } else if(w > this.barWidth) {
                    w = this.barWidth;
                }
                this.model.u.width("vodPlayingBar", w);
                this.model.u.e("vodSlider").style.left = (w-8)+"px";
            }
        }
    }

    /**
     * 跳转完成
     * @param event
     */
    private seekedHandler(event: Event): void {
        if(this.clickListenerRemoved && this.model.seeked) {
            this.model.u.e("vodProgressBar").addEventListener("click", this.tempMouseHandler);
            this.clickListenerRemoved = false;
        }
    }

    /**
     * 看点鼠标
     * @param event
     */
    private mover(event?: MouseEvent): void {
        let node: HTMLElement = event.currentTarget as HTMLElement;
        let imageHeight: number = 90;
        let textHeight: number = 40;
        let panelWidth: number = 190;//更改宽度，相应的修改文字折行字数
        let panelHeight: number = imageHeight+textHeight;

        this.focusPanel.innerHTML = "";
        this.model.u.display(this.focusPanel, "block");
        this.model.u.x(this.focusPanel, this.model.u.getX(node) - Math.floor((panelWidth - this.model.u.getWidth(node))/2) + 10);//panel宽，10 进度条左端间距
        if(this.model.u.getX(this.focusPanel) < 0) {
            this.model.u.x(this.focusPanel, 0);
        } else if(this.model.u.getX(this.focusPanel) > (G.stageWidth[this.model.idHeader].stageWidth-this.model.u.getWidth(this.focusPanel))) {
            this.model.u.x(this.focusPanel, G.stageWidth[this.model.idHeader].stageWidth-this.model.u.getWidth(this.focusPanel));
        }

        if((node.dataset as any).cutimage.length > 0) {
            //有图
            this.model.u.height(this.focusPanel, panelHeight);
            this.model.u.y(this.focusPanel, G.stageHeight[this.model.idHeader].stageHeight-185);
        } else {
            //无图
            this.model.u.height(this.focusPanel, textHeight);
            this.model.u.y(this.focusPanel, G.stageHeight[this.model.idHeader].stageHeight-95);
        }

        //图
        let p: string = (node.dataset as any).cutimage;
        if(p.length > 0) {
            let imgContainer: HTMLElement = document.createElement("div");
            this.model.u.height(imgContainer, imageHeight);
            let img: HTMLImageElement = document.createElement("img");
            img.src = p;
            img.width = panelWidth;
            img.height = imageHeight;
            imgContainer.appendChild(img);
            this.focusPanel.appendChild(imgContainer);
        }

        //字
        let t: string = (node.dataset as any).title;
        t = t.slice(0, 22);
        let starttime: string = this.model.u.formatTime((node.dataset as any).start);
        if(t.length > 0) {
            let d: HTMLElement = document.createElement("div");
            this.model.u.height(d, textHeight);
            d.style.paddingRight = "2px";
            d.style.paddingLeft = "2px";
            if(t.length < 10) {
                d.style.lineHeight = textHeight+"px";
            }
            d.innerHTML = starttime + " " +t;
            this.focusPanel.appendChild(d);
        }
    }
    private mout(event?: MouseEvent): void {
        this.model.u.display(this.focusPanel, "none");
    }
    private mclick(event?: MouseEvent): void {
        let node: HTMLElement = event.currentTarget as HTMLElement;
        let pct: number = (this.model.u.getX(node)+event.offsetX) / this.barWidth;
        this.controller.seek(pct);

        event.stopPropagation();
    }

    /**
     * 禁选文本
     * @param event
     * @returns {boolean}
     */
    private selectHandler(event: Event): boolean {
        return false;
    }
}
