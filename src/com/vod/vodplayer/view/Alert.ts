import {Model} from "../model/Model";
import {U} from "./utils/U";
import {E} from "../E";
import {D} from "../../../../D";
import {G} from "../../../../G";
/**
 * Created by yangfan on 2016/9/22.
 */
export class Alert {
    private model: Model;
    private container: HTMLElement;
    private tempClickHandler: any;
    private tempAlertHandler: any;

    public constructor(m: Model) {
        this.model = m;
        this.init();
    }
    private init(): void {
        this.container = this.model.u.e("vodAlertPanel");
        this.model.u.display(this.container, "none");
        this.tempClickHandler = this.clickDocument.bind(this);
        this.tempAlertHandler = this.alertHandler.bind(this);
        this.model.dispatcher.addEventListener(E.ALERT, this.tempAlertHandler);
    }
    private alertHandler(event: Event): void {
        let display: string = this.model.u.getDisplay(this.container);
        if(display === "none") {
            this.model.u.display(this.container, "block");
            this.model.u.x(this.container, G.stageWidth[this.model.idHeader].stageWidth-210);
            this.model.u.y(this.container, G.stageHeight[this.model.idHeader].stageHeight-106);
            this.container.innerHTML = "<div>"+this.model.alertWindow+"</div>";
            window.document.addEventListener("click", this.tempClickHandler, true);
        }
    }

    /**
     *  先监听document的捕获阶段，
     *  响应到捕获阶段后，
     *  移除该监听，亦移除对E.ALERT的监听，避免响应E.ALERT前监听到document的冒泡阶段
     *  此时还要加上对document冒泡阶段的监听，
     *  响应到document冒泡阶段后，再补充对E.ALERT的监听。
     *
     * @param event
     */
    private clickDocument(event: MouseEvent): void {
        if(event.eventPhase === Event.BUBBLING_PHASE) {
            //D.d("BUBBLING");
            window.document.removeEventListener("click", this.tempClickHandler);
            this.model.dispatcher.addEventListener(E.ALERT, this.tempAlertHandler);
        } else if(event.eventPhase === Event.CAPTURING_PHASE) {
            //D.d("CAPTURING");
            window.document.removeEventListener("click", this.tempClickHandler, true);
            this.model.dispatcher.removeEventListener(E.ALERT, this.tempAlertHandler);
            window.document.addEventListener("click", this.tempClickHandler);

            this.model.u.display(this.container, "none");
        }
    }
}
