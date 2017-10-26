import {G} from "../../../../../G";
import {Controller} from "../../controller/Controller";
import {Model} from "../../model/Model";
import {U} from "../utils/U";
import {D} from "../../../../../D";
import {E} from "../../E";
/**
 * Created by yangfan on 2017/2/13.
 */
export class PlaybackRatePanel {
    private model: Model;
    private controller: Controller;
    private panel: HTMLElement;
    private close: HTMLElement;
    private radioArr: HTMLInputElement[] = [];

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;
        this.init();
    }

    public show(): void {
        this.model.u.display(this.panel, "block");
        this.resize();
    }
    public hide(): void {
        this.model.u.display(this.panel, "none");
    }

    public resize(): void {
        this.model.u.x(this.panel, Math.floor((G.stageWidth[this.model.idHeader].stageWidth - this.model.u.getWidth(this.panel))/2));
        this.model.u.y(this.panel, Math.floor((G.stageHeight[this.model.idHeader].stageHeight - this.model.u.getHeight(this.panel))/2));
    }

    private init(): void {
        this.panel = this.model.u.e("vodRatePanel");
        this.close = this.model.u.e("vodRatePanelClose");
        this.model.u.display(this.panel, "none");

        this.close.addEventListener("click", this.closeHandler.bind(this));

        const tempArr: NodeList = this.panel.getElementsByTagName("input");
        let tempRadio: HTMLInputElement;
        for(let j: number=0; j<tempArr.length; j++) {
            tempRadio = (tempArr[j] as HTMLInputElement);
            tempRadio.addEventListener("click", this.radioHandler.bind(this));
            this.radioArr.push(tempRadio);
            if(tempRadio.value === "1") {
                tempRadio.checked = true;
            }
        }

        //更新界面
        this.model.dispatcher.addEventListener(E.PLAYBACKRATE, this.rateHandler.bind(this));
    }

    /**
     * 更新界面
     * @param event
     */
    private rateHandler(event?:Event):void {
        for(let i: number = 0; i<this.radioArr.length; i++) {
            if(Number(this.radioArr[i].value) === this.model.playbackRate) {
                this.radioArr[i].checked = true;
            } else {
                this.radioArr[i].checked = false;
            }
        }
    }

    /**
     * 点击
     * click - Controller - Model - CheckPanelBody : 更新界面
     *                            - PlaybackRatePanel : 更新界面
     *                            - Stream : video.playbackRate赋值
     * @param event
     */
    private radioHandler(event?: MouseEvent): void {
        const radio: HTMLInputElement = event.currentTarget as HTMLInputElement;
        this.controller.playbackRate(Number(radio.value));
    }

    private closeHandler(event?: MouseEvent): void {
        this.hide();
    }

}
