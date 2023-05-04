import {Model} from "../model/Model";
import {Controller} from "../controller/Controller";
import {U} from "./utils/U";
import {D} from "../../../../D";
import {G} from "../../../../G";
import {E} from "../E";
import {PlaybackRatePanel} from "./playbackrate/PlaybackRatePanel";
/**
 * Created by yangfan on 2016/8/23.
 */
export class Setting {

    private model: Model;
    private controller: Controller;
    private btn: HTMLElement;//控制栏按钮
    private tempClickHandler: any;
    private ratePanel: PlaybackRatePanel;

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;

        this.init();
    }

    public resize(): void {
        if(this.ratePanel) {
            this.ratePanel.resize();
        }
    }

    private init(): void {
        this.btn = this.model.u.e("vodSettingBtn");
        this.ratePanel = new PlaybackRatePanel(this.model, this.controller);

        this.tempClickHandler = this.clickHandler.bind(this);
        this.btn.addEventListener("click", this.clickHandler.bind(this));
        this.model.dispatcher.addEventListener(E.CLICK_DOCUMENT, this.clickDoc.bind(this));

        let itemArr: any = this.model.u.e("vodSettingItems").getElementsByTagName("div");
        for (let i: number = 0; i < itemArr.length; i++) {
            //移进移出样式
            itemArr[i].onmouseover = this.menuOver;
            itemArr[i].onmouseout = this.menuOut;
            itemArr[i].onclick = this.menuClick.bind(this);
        }

        let imgArr: any = this.model.u.e("vodSettingItems").getElementsByTagName("img");
        for (let j: number = 0;j < imgArr.length; j++) {
            imgArr[j].style.display = "none";
        }
    }

    /**
     * 点击item
     * @param event
     */
    private menuClick(event: MouseEvent): void {
        const tempArr:string[] = (event.currentTarget as HTMLElement).id.split("_");
        switch (tempArr[tempArr.length-1]) {
            case "vodSpeedItem":
                this.ratePanel.show();
                this.hide();
                break;
            case "vodSpeechItem":
                //语音控制
                break;
            default:
                break;
        }
    }

    /**
     * 移入item
     * @param event
     */
    private menuOver(event: Event): void {
        (event.currentTarget as HTMLElement).className = "vodSettingItemHover";
        //(event.currentTarget as HTMLElement).getElementsByTagName("img")[0].style.display = "block";
    }

    /**
     * 移出item
     * @param event
     */
    private menuOut(event: Event): void {
        (event.currentTarget as HTMLElement).className = "";
        //(event.currentTarget as HTMLElement).getElementsByTagName("img")[0].style.display = "none";
    }

    /**
     * 点击控制栏设置按钮
     * @param event
     */
    private clickHandler(event: MouseEvent): void {
        let id1: string = ((event.target as HTMLElement).parentNode as HTMLElement).id;
        let id2: string = ((event.target as HTMLElement).parentNode.parentNode as HTMLElement).id;
        if(id1 === "vodSettingItems" || id2 === "vodSettingItems") {
            return;//点击设置面板item后，面板不隐藏。
        }

        let display: string = this.model.u.e("vodSettingPanel").style.display;
        if(event.currentTarget === window.document && display === "block") {
            this.hide();
        } else if(display === "block") {
            this.hide();
        } else if(display !== "block") {
            this.model.u.display("vodSettingPanel", "block");
            this.model.u.e("vodSettingPanel").style.left = (G.stageWidth[this.model.idHeader].stageWidth-156)+"px";
            // this.model.u.e("vodSettingPanel").style.top = (G.stageHeight[this.model.idHeader].stageHeight-129)+"px";//距下间距和清晰度菜单一致
            this.model.u.e("vodSettingPanel").style.top = (document.getElementsByClassName("vodplayercontainer")[0].getBoundingClientRect().height - 135) + "px";
            event.stopPropagation();
            window.document.addEventListener("click", this.tempClickHandler);

            this.controller.clickDocument("Setting");
        }
    }

    private clickDoc(): void {
        if(this.model.clickDoc !== "Setting") {
            this.hide();
        }
    }

    private hide(): void {
        window.document.removeEventListener("click", this.tempClickHandler);
        this.model.u.display("vodSettingPanel", "none");
    }
}
