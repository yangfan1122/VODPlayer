import {Model} from "../model/Model";
import {Controller} from "../controller/Controller";
import {U} from "./utils/U";
import {D} from "../../../../D";
import {G} from "../../../../G";
import {E} from "../E";
/**
 * Created by yangfan on 2016/8/29.
 */
export class Quality {
    private model: Model;
    private controller: Controller;
    private btn: HTMLElement;//控制栏按钮
    private tempClickHandler: any;

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;

        this.init();
    }

    private init(): void {
        this.btn = this.model.u.e("vodQualityBtn");
        this.model.u.e("vodQualityPanel").style.display = "none";

        this.tempClickHandler = this.clickHandler.bind(this);
        this.btn.addEventListener("click", this.tempClickHandler);
        this.model.dispatcher.addEventListener(E.CLICK_DOCUMENT, this.clickDoc.bind(this));
        this.model.dispatcher.addEventListener(E.CHANGE_QUALITY, this.changeQuality.bind(this));
        this.model.dispatcher.addEventListener(E.NO_SD, this.resetMenu.bind(this));
        this.model.dispatcher.addEventListener(E.NO_HD, this.resetMenu.bind(this));

        let itemArr: any = this.model.u.e("vodQualityItems").getElementsByTagName("div");
        for (let i: number = 0; i < itemArr.length; i++) {
            //移进移出样式
            itemArr[i].onmouseover = this.menuOver;
            itemArr[i].onmouseout = this.menuOut;
            itemArr[i].onclick = this.menuClick.bind(this);
        }

        let imgArr: any = this.model.u.e("vodQualityItems").getElementsByTagName("img");
        for (let j: number = 0;j < imgArr.length; j++) {
            imgArr[j].style.display = "none";
        }
    }

    /**
     * 重置菜单
     * @param event
     */
    private resetMenu(event?: Event) {
        if(this.model.noThisQuality === "sd") {
            this.btnLabel("hd");
        } else if(this.model.noThisQuality === "hd") {
            this.btnLabel("sd");
        }
        this.btn.removeEventListener("click", this.tempClickHandler);
        this.model.u.css("vodQuality", "vodQualityDisabled");
    }

    /**
     * 点击item
     * @param event
     */
    private menuClick(event: MouseEvent): void {
        const tempArr:string[] = (event.currentTarget as HTMLElement).id.split("_");
        switch (tempArr[tempArr.length-1]) {
            case "vodHDItem":
                this.controller.changeVideoQuality("hd");
                break;
            case "vodSDItem":
                this.controller.changeVideoQuality("sd");
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
        (event.currentTarget as HTMLElement).className = "vodQualityItemHover";
        (event.currentTarget as HTMLElement).getElementsByTagName("img")[0].style.display = "block";
    }

    /**
     * 移出item
     * @param event
     */
    private menuOut(event: Event): void {
        (event.currentTarget as HTMLElement).className = "";
        (event.currentTarget as HTMLElement).getElementsByTagName("img")[0].style.display = "none";
    }

    /**
     * 点击控制栏设置按钮
     * @param event
     */
    private clickHandler(event: MouseEvent): void {
        let display: string = this.model.u.getDisplay("vodQualityPanel");
        if(event.currentTarget === window.document && display === "block") {
            window.document.removeEventListener("click", this.tempClickHandler);
            this.model.u.display("vodQualityPanel", "none");
        } else if(display === "block") {
            window.document.removeEventListener("click", this.tempClickHandler);
            this.model.u.display("vodQualityPanel", "none");
        } else if(display === "none") {
            this.model.u.display("vodQualityPanel", "block");
            this.model.u.x("vodQualityPanel", G.stageWidth[this.model.idHeader].stageWidth-118);

            if(this.model.u.getHeight("vodQualityPanel") === 46) {
                this.model.u.y("vodQualityPanel", G.stageHeight[this.model.idHeader].stageHeight-92);
            } else if(this.model.u.getHeight("vodQualityPanel") === 82) {
                this.model.u.y("vodQualityPanel", G.stageHeight[this.model.idHeader].stageHeight-128);
            }

            event.stopPropagation();
            window.document.addEventListener("click", this.tempClickHandler);

            this.controller.clickDocument("Quality");
        }
    }

    private clickDoc(): void {
        if(this.model.clickDoc !== "Quality") {
            window.document.removeEventListener("click", this.tempClickHandler);
            this.model.u.display("vodQualityPanel", "none");
        }
    }

    private btnLabel(q: string): void {
        if(q === "sd") {
            // this.btn.innerHTML = "\u6d41\u7545";//流畅
            this.btn.innerHTML = "SD";//流畅
        } else if(q === "hd") {
            // this.btn.innerHTML = "\u9ad8\u6e05";//高清
            this.btn.innerHTML = "HD";//高清
        }
    }

    private changeQuality(event: Event): void {
        this.btnLabel(this.model.quality);
    }
}
