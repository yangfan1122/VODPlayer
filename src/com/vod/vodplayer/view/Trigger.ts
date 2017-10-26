import {Model} from "../model/Model";
import {U} from "./utils/U";
import {D} from "../../../../D";
import {Controller} from "../controller/Controller";
import {E} from "../E";
import {G} from "../../../../G";
/**
 * Created by yangfan on 2016/8/13.
 */
export class Trigger {
    private model: Model;
    private controller: Controller;
    private toggleBtn: HTMLElement;

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;
        this.toggleBtn = this.model.u.e("vodToggle");
        this.init();
    }
    private init(): void {
        this.toggleBtn.addEventListener("click", this.clickHandler.bind(this));
        const screen:HTMLElement = this.model.u.e("vodVideoContainer");
        screen.addEventListener("click", this.clickScreen.bind(this));

        this.model.dispatcher.addEventListener(E.PLAY_ING, this.playingHandler.bind(this));
        this.model.dispatcher.addEventListener(E.PLAY_COMPLETE, this.playComplete.bind(this));
        this.model.dispatcher.addEventListener(E.STH_WRONG, this.sthWrong.bind(this));
        this.model.dispatcher.addEventListener(E.DISPOSE, this.disposeHandler.bind(this));
    }

    private clickScreen(event:MouseEvent):void {
        this.toggleBtn.dispatchEvent(new MouseEvent("click"));
    }

    private clickHandler(event: MouseEvent): void {
        let btn: HTMLElement = event.target as HTMLElement;
        if(btn.className === "vodPlayBtn") {
            this.controller.toggle(true);
        } else if(btn.className === "vodPauseBtn") {
            this.controller.toggle(false);
        }
    }

    private pauseStyle(): void {
        this.toggleBtn.className = "vodPlayBtn";
        this.model.u.css("vodToggleContainer", "vodPlayBtn");
    }

    private playingHandler(event: Event): void {
        D.d("Trigger, playing: "+this.model.playing);
        if(this.model.playing) {
            this.toggleBtn.className = "vodPauseBtn";
            this.model.u.css("vodToggleContainer", "vodPauseBtn");
        } else {
            this.pauseStyle();
        }
    }

    private playComplete(event: Event): void {
        if(this.model.playComplete === 1) {
            this.pauseStyle();
        }
    }

    private sthWrong(event: Event): void {
        if(this.model.issue > 0) {
            D.d("Trigger, sth wrong");
            this.pauseStyle();
        }
    }

    private disposeHandler(event:Event):void {
        if(!this.model.dispose) {
            if(G.params[this.model.idHeader].autoplay !== "true" || G.params[this.model.idHeader].autoplay !== true) {
                this.pauseStyle();
            }
        }
    }

}
