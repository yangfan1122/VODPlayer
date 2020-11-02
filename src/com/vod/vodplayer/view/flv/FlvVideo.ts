import {Utils} from "../../controller/utils/Utils";
declare function require(moduleNames: string[], onLoad: (...args: any[]) => void, onError: (...args: any[]) => void): void;
declare let bowlder: any;

import {Model} from "../../model/Model";
import {Controller} from "../../controller/Controller";
import {Snapshot} from "../snapshot/Snapshot";
import {D} from "../../../../../D";
import {G} from "../../../../../G";
import {E} from "../../E";
/**
 * Created by Administrator on 2017/8/24.
 */

export class FlvVideo {
    private model:Model;
    private controller:Controller;
    private snapshot:Snapshot;
    private loading: HTMLElement;
    private flvPlayer: any;
    private flvStatic: any;
    private video:HTMLVideoElement;
    private flvjs:any;

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
        let self: FlvVideo = this;
        let flvPath: string = "";
        if(G.params[this.model.idHeader].flvJSPath) {
            flvPath = G.params[this.model.idHeader].flvJSPath;
        } else {
            D.w('flv.js path is empty')
        }
        let loadModel: any;
        try {
            loadModel = bowlder.run;
        } catch (error) {
            const w: any = window
            loadModel = require || w.require;
        }

        loadModel([flvPath], (flv: any) => {
            D.d("flv.js Lib loaded");
            self.flvStatic = flv;
            self.flvjs = flv.flvjs;
            if(this.model.flvSrc.length > 0) {
                self.loadFlv();
            }
        }, (error: any) => {
            D.e(error);
            self.controller.toggle(false);
            self.model.issue = 9;
        });

        this.model.dispatcher.addEventListener(E.FLV_SRC, this.loadFlv.bind(this));
        this.model.dispatcher.addEventListener(E.SNAPSHOT, this.snapshotHandler.bind(this));
        this.model.dispatcher.addEventListener(E.CHANGE_SCALE, this.changeScale.bind(this));
        this.model.dispatcher.addEventListener(E.LOADING, this.loadingHandler.bind(this));
    }

    private loadFlv():void {
        if(!this.flvStatic) {
            return;
        }

        if(this.flvPlayer) {
            this.flvPlayer.destroy();
            this.flvPlayer = null;
        }

        D.d("this.model.flvSrc = "+this.model.flvSrc);

        if(this.flvStatic.isSupported()) {
            let src:string = this.model.flvSrc;
            if(src.indexOf("?") > -1) {
                src += "&"+(new Date()).getTime();
            } else {
                src += "?"+(new Date()).getTime();
            }
            this.flvPlayer = this.flvStatic.createPlayer({
                type: "flv",
                url: src
            });
            this.flvPlayer.attachMediaElement(this.video);
            this.flvPlayer.load();
        } else {
            this.model.issue = 10;
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
