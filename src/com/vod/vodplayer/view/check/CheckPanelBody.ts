import {Model} from "../../model/Model";
import {Controller} from "../../controller/Controller";
import {U} from "../utils/U";
import {D} from "../../../../../D";
import {E} from "../../E";
import {UI} from "../UI";
/**
 * Created by yangfan on 2017/3/14.
 */
export class CheckPanelBody {
    private model:Model;
    private controller:Controller;
    private menu:HTMLElement;
    private ui:UI;

    public constructor(m:Model, c:Controller, u:UI) {
        this.model = m;
        this.controller = c;
        this.ui = u;
    }

    public init():void {
        const checkContainer: HTMLElement = this.model.u.e("vodCheckContainer");

        //播放速度
        const defaultLabelElement:HTMLDivElement = this.ui.div("", "vodCheckSpeedMenu");
        // defaultLabelElement.innerHTML = "1\u500d";//1倍
        defaultLabelElement.innerHTML = "1 ";//1倍
        checkContainer.appendChild(defaultLabelElement);

        //播放速度按钮
        this.menu = this.model.u.e("vodCheckSpeedMenu");
        this.menu.addEventListener("click", this.clickHandler.bind(this));

        //更新界面
        this.model.dispatcher.addEventListener(E.PLAYBACKRATE, this.rateHandler.bind(this));
    }

    /**
     * 更新界面
     * @param event
     */
    private rateHandler(event?:Event):void {
        // const content:string = this.model.playbackRate+"\u500d";
        const content:number = this.model.playbackRate;
        this.menu.innerHTML = content.toString();
    }

    /**
     * 点击操作
     * @param event
     */
    private clickHandler(event?:MouseEvent):void {
        const content:string = this.menu.innerHTML;
        if(content === "1 ") {
            this.controller.playbackRate(2);
        } else if(content === "2 ") {
            this.controller.playbackRate(3);
        } else if(content === "3 ") {
            this.controller.playbackRate(1);
        } else {
            this.controller.playbackRate(1);
        }
    }
}