import {Controller} from "../controller/Controller";
import {Model} from "../model/Model";
import {G} from "../../../../G";
import {U} from "./utils/U";
import {ProgressBar} from "./ProgressBar";
import {D} from "../../../../D";
import {E} from "../E";
import {Volume} from "./Volume";
import {Trigger} from "./Trigger";
import {Menu} from "./menu/Menu";
import {Setting} from "./Setting";
import {Video} from "./Video";
import {Quality} from "./Quality";
import {FullScreen} from "./FullScreen";
import {Tips} from "./Tips";
import {Cover} from "./Cover";
import {Alert} from "./Alert";
import {VRVideo} from "./vr/VRVideo";
import {Timer} from "../controller/utils/Timer";
import {CheckPanelBody} from "./check/CheckPanelBody";
import {HLSVideo} from "./hls/HLSVideo";
import {UI} from "./UI";
import {FlvVideo} from "./flv/FlvVideo";

/**
 * Created by yangfan on 2016/7/25.
 */
export class View {
    private container: HTMLElement;
    private model: Model;
    private controller: Controller;
    private progressBar: ProgressBar;
    private volume: Volume;
    private trigger: Trigger;
    private setting: Setting;
    private video: any;//Video VRVideo
    private quality: Quality;
    private fullScreen: FullScreen;
    private tips: Tips;
    private cover: Cover;
    private alertWin: Alert;
    private resizeTimer: Timer;
    private observer:MutationObserver;
    private observerConfig:any = {
        // attributeFilter: ["id"]
        childList:true,
        attributes:true,
        characterData:true,
        subtree:true,
        attributeOldValue:true,
        characterDataOldValue:true
    };

    public constructor(m: Model, c: Controller, co: HTMLElement) {
        this.model = m;
        this.controller = c;
        this.container = co;

        this.init();
        this.controller.init();
    }

    private init(): void {
        // TODO:监听播放器实例变化，未成功
        // this.observer = new MutationObserver(observerHandler.bind(this));
        // function observerHandler(mutations:MutationRecord[]):void {
        //     mutations.forEach(function(mutation:MutationRecord):void {
        //         if(mutation.type === "attributes" && mutation.attributeName === "class") {
        //             this.model.dispose = true;
        //         }
        //     }.bind(this));
        //     // this.observer.disconnect();
        //     // this.observer = null;
        // }
        // // this.observer.observe(this.container, this.observerConfig);
        this.container.className = "vodplayercontainer";

        const u:U = new U(this.container.id);
        this.model.u = u;

        //界面
        this.model.idHeader = this.container.id;
        const ui:UI = new UI(this.container as HTMLDivElement, this.model);
        G.movieInfo[this.model.idHeader] = {};
        this.mouseLeaveHandler();

        //初始化界面组件会用到
        G.stageWidth[this.model.idHeader] = {};
        G.stageHeight[this.model.idHeader] = {};
        G.stageWidth[this.model.idHeader].stageWidth = this.container.clientWidth;
        G.stageHeight[this.model.idHeader].stageHeight = this.container.clientHeight;

        //右键菜单
        const menu: Menu = new Menu(this.model);
        menu.init();

        //元件
        this.progressBar = new ProgressBar(this.model, this.controller);
        this.volume = new Volume(this.model, this.controller);
        this.trigger = new Trigger(this.model, this.controller);
        this.setting = new Setting(this.model, this.controller);
        this.quality = new Quality(this.model, this.controller);
        this.fullScreen = new FullScreen(this.model, this.controller, this.container);
        this.tips = new Tips(this.model);
        this.cover = new Cover(this.model, this.controller);
        this.alertWin = new Alert(this.model);

        //审核后台版
        if(G.params[this.model.idHeader].check === "1" && G.stageWidth[this.model.idHeader].stageWidth>408) {
            const checkPanelBody:CheckPanelBody = new CheckPanelBody(this.model, this.controller, ui);
            checkPanelBody.init();

            //默认倍速
            const playbackRateDefault:string = G.params[this.model.idHeader].playbackrate;
            if(playbackRateDefault === "1" || playbackRateDefault === "2" || playbackRateDefault === "3") {
                this.controller.playbackRateDefault = playbackRateDefault;
            }
        } else if(G.params[this.model.idHeader].check === "1" && G.stageWidth[this.model.idHeader].stageWidth<408) {
            D.e("stageWidth is not wide enough!");
        }

        //视频类型
        this.model.dispatcher.addEventListener(E.VTYPE, this.vtypeHandler.bind(this));

        //container resize
        this.resizeTimer = new Timer(this.containerResizeHandler.bind(this), 50);
        this.resizeTimer.start();

        if(G.params[this.model.idHeader].control === "1") {
            this.container.addEventListener("mouseleave", this.mouseLeaveHandler.bind(this));
            this.container.addEventListener("mouseenter", this.mouseEnterHandler.bind(this));
        }

        //键盘
        //监听this.container的键盘事件时，会导致监听无法回收。
        const keyTarget1:HTMLDivElement = this.model.u.e("vodVideoContainer") as HTMLDivElement;
        const keyTarget2:HTMLDivElement = this.model.u.e("vodCtrlContainer") as HTMLDivElement;
        keyTarget1.tabIndex = 0;
        keyTarget2.tabIndex = 0;
        keyTarget1.addEventListener("keyup", this.keyboard.bind(this));
        keyTarget2.addEventListener("keyup", this.keyboard.bind(this));
    }

    private containerResizeHandler(forced: boolean = false): void {
        if(this.model.u.getWidth(this.container) === 0) {
            if(!this.model.dispose) {
                this.model.dispose = true;
            }
            this.resizeTimer.stop();
            return;
        } else if(this.model.u.getWidth(this.container) > 0) {
            if(this.model.dispose) {
                this.model.dispose = false;
            }
        }

        if(G.stageWidth[this.model.idHeader].stageWidth !== this.model.u.getWidth(this.container) || forced) {
            G.stageHeight[this.model.idHeader].stageHeight = this.model.u.getHeight(this.container);
            G.stageWidth[this.model.idHeader].stageWidth = this.model.u.getWidth(this.container);
            D.d("container resize, "+G.stageWidth[this.model.idHeader].stageWidth+"*"+G.stageHeight[this.model.idHeader].stageHeight);

            this.progressBar.resize();
            this.video.resize();
            this.tips.resize();
            this.cover.resize();
            this.setting.resize();
        }
    }

    /**
     * 全景 HLS MP4 FLV
     * @param event
     */
    private vtypeHandler(event: Event): void {
        D.d("this.model.vType = "+this.model.vType);
        if(this.model.vType === 1) {
            this.video = new VRVideo(this.model, this.controller, this.model.u.e("vodVideo") as HTMLVideoElement);
        } else if(this.model.vType === 2) {
            this.video = new HLSVideo(this.model, this.controller, this.model.u.e("vodVideo") as HTMLVideoElement, this.container);
        } else if(this.model.vType === 3) {
            this.video = new FlvVideo(this.model, this.controller, this.model.u.e("vodVideo") as HTMLVideoElement, this.container);
        } else {
            this.video = new Video(this.model, this.controller, this.model.u.e("vodVideo") as HTMLVideoElement);
        }
        this.containerResizeHandler(true);
    }

    /**
     * 鼠标移出舞台
     * @param event
     */
    private mouseLeaveHandler(event: MouseEvent = null): void {
        this.model.u.css("vodCtrlContainer", "vodCtrlContainer vodAlphaOut");
        G.onStage = false;
    }

    /**
     * 鼠标移入舞台
     * @param event
     */
    private mouseEnterHandler(event: MouseEvent): void {
        this.model.u.css("vodCtrlContainer", "vodCtrlContainer vodAlphaIn");
        G.onStage = true;
    }

    /**
     * 响应键盘
     * @param event
     */
    private keyboard(event:KeyboardEvent):void {
        const duration:number = G.movieInfo[this.model.idHeader].duration;
        const nowPCT:number = this.model.timeupdate;//%
        let pct:number;
        const seconds:number = 5;
        if(event.key === "ArrowLeft") {
            pct = (nowPCT*duration-seconds)/duration;
            if(pct < 0) {
                pct = 0;
            }
            this.controller.seek(pct);
        } else if(event.key === "ArrowRight") {
            pct = (nowPCT*duration+seconds)/duration;
            if(pct > 1) {
                pct = 1;
            }
            this.controller.seek(pct);
        }
    }
}
