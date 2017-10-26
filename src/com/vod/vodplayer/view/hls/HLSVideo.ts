declare function require(moduleNames: string[], onLoad: (...args: any[]) => void, onError: (...args: any[]) => void): void;
declare let bowlder: any;
import {Controller} from "../../controller/Controller";
import {Model} from "../../model/Model";
import {G} from "../../../../../G";
import {D} from "../../../../../D";
import {E} from "../../E";
import {Snapshot} from "../snapshot/Snapshot";
import {Utils} from "../../controller/utils/Utils";
/**
 * Created by Administrator on 2017/5/10.
 */
export class HLSVideo {
    private model:Model;
    private controller:Controller;
    private video:HTMLVideoElement;
    private hls: any;
    private HLSStatic: any;
    private snapshot:Snapshot;
    private loading: HTMLElement;

    public constructor(m: Model, c: Controller, v: HTMLVideoElement, container?:HTMLElement) {
        this.model = m;
        this.controller = c;
        this.video = v;
        this.snapshot = new Snapshot(this.video, this.model);

        this.init();
    }

    public resize():void {
        this.changeScale();
    }

    private init():void {
        this.loading = this.model.u.e("vodLoading");
        let self: HLSVideo = this;
        let HLSPath: string = "";
        if(Utils.isLocal()) {
            HLSPath = "../../../../../../libs/hls.min";
        } else {
            HLSPath = "//cdn.rawgit.com/yangfan1122/docs/gh-pages/assets/hls.min.js";
        }
        let loadModel: any;
        try {
            loadModel = bowlder.run;
        } catch (error) {
            D.w("no bowlder.run");
            loadModel = require;
        }

        loadModel([HLSPath], (HLS: any) => {
            D.d("HLS Lib loaded");
            self.HLSStatic = HLS;
            if(this.model.hlsSrc.length > 0) {
                //第一次E.HLS_SRC会在HLSLib加载好之前触发
                //hlsSrc赋过值后手动loadHLS()
                self.loadHLS();
            }
        }, (error: any) => {
            D.e(error);
            self.controller.toggle(false);
            self.model.issue = 8;
        });

        this.model.dispatcher.addEventListener(E.HLS_SRC, this.loadHLS.bind(this));
        this.model.dispatcher.addEventListener(E.SNAPSHOT, this.snapshotHandler.bind(this));
        this.model.dispatcher.addEventListener(E.CHANGE_SCALE, this.changeScale.bind(this));
        this.model.dispatcher.addEventListener(E.LOADING, this.loadingHandler.bind(this));
    }

    private loadHLS(event?:Event):void {
        if(!this.HLSStatic) {
            return;
        }

        if(this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        this.hls = new this.HLSStatic();
        this.hls.on(this.HLSStatic.Events.MEDIA_ATTACHED, this.attached.bind(this));
        this.hls.attachMedia(this.video);
    }

    private attached(event?: Event): void {
        D.d("hls attached, model.hlsSrc = "+this.model.hlsSrc);
        this.hls.on(this.HLSStatic.Events.MANIFEST_PARSED, this.manifestParsed.bind(this));
        this.hls.on(this.HLSStatic.Events.ERROR, this.errorHandler.bind(this));
        let src:string = this.model.hlsSrc;
        if(src.indexOf("?") > -1) {
            src += "&"+(new Date()).getTime();
        } else {
            src += "?"+(new Date()).getTime();
        }
        this.hls.loadSource(src);
    }

    private manifestParsed(event: Event): void {
        D.d("manifestParsed");
        this.model.dispatch(E.HLS_MANIFEST_PARSED);
    }
    private errorHandler(event: Event, data?: any): void {
        let errorType: string = data.type;
        let errorDetails: string = data.details;
        let errorFatal: boolean = data.fatal;
        D.consolelog("errorDetails: "+errorDetails);
        if (errorFatal) {
            switch (errorType) {
                case this.HLSStatic.ErrorTypes.NETWORK_ERROR:
                    D.e("fatal network error encountered, try to recover");
                    this.hls.startLoad();
                    break;
                case this.HLSStatic.ErrorTypes.MEDIA_ERROR:
                    D.e("fatal media error encountered, try to recover");
                    this.hls.recoverMediaError();
                    break;
                default:
                    D.e("cannot recover");
                    this.hls.destroy();
                    break;
            }
        }
    }

    /**
     * 快照
     * @param event
     */
    private snapshotHandler(event?:Event):void {
        this.snapshot.snapshot();
    }

    private changeScale(event: Event = null): void {
        this.model.u.e("vodVideoContainer").style.width = "100%";
        this.model.u.e("vodVideoContainer").style.height = "100%";
        this.model.u.x("vodVideoContainer", Math.floor((G.stageWidth[this.model.idHeader].stageWidth - this.model.u.getWidth("vodVideoContainer"))/2));
        this.model.u.y("vodVideoContainer", Math.floor((G.stageHeight[this.model.idHeader].stageHieght - this.model.u.getHeight("vodVideoContainer"))/2));

        //snapshot
        this.snapshot.snapshot();
    }

    private loadingHandler(event?:Event):void {
        if(this.model.loading) {
            this.model.u.display(this.loading, "block");
        } else {
            this.model.u.display(this.loading, "none");

            //D.d("display of canvas is setting none from loadingHandler");
            this.model.u.display("vodCanvasContainer", "none");
        }
    }
}