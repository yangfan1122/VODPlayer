import {Controller} from "../controller/Controller";
import {Model} from "../model/Model";
import {E} from "../E";
import {D} from "../../../../D";
import {G} from "../../../../G";
import {Timer} from "../controller/utils/Timer";
import {U} from "./utils/U";
import {Snapshot} from "./snapshot/Snapshot";
/**
 * Created by yangfan on 2016/8/24.
 */
export class Video {
    private model: Model;
    private controller: Controller;
    private video: HTMLVideoElement;
    private videoSizeTimer: Timer;
    private loading: HTMLElement;
    private sthIsWrong:boolean = false;
    private snapshot:Snapshot;

    public constructor(m: Model, c: Controller, v: HTMLVideoElement) {
        this.model = m;
        this.controller = c;
        this.video = v;
        this.snapshot = new Snapshot(this.video, this.model);

        this.init();
    }

    public resize(): void {
        this.changeScale();
    }

    private init(): void {
        this.loading = this.model.u.e("vodLoading");

        this.model.dispatcher.addEventListener(E.CHANGE_SCALE, this.changeScale.bind(this));
        this.model.dispatcher.addEventListener(E.SNAPSHOT, this.snapshotHandler.bind(this));
        this.model.dispatcher.addEventListener(E.PLAY_ING, this.playing.bind(this));
        this.model.dispatcher.addEventListener(E.PLAY_COMPLETE, this.playComplete.bind(this));
        this.model.dispatcher.addEventListener(E.LOADING, this.loadingHandler.bind(this));
        this.model.dispatcher.addEventListener(E.STH_WRONG, this.sthWrong.bind(this));

        this.videoSizeTimer = new Timer(this.videoSizeTimerHandler.bind(this), 100);
        this.videoSizeTimer.start();
    }

    private videoSizeTimerHandler(): void {
        if(this.video.videoHeight>0 && this.video.videoWidth>0) {
            this.videoSizeTimer.stop();
            this.resize();
        }
    }

    private changeScale(event: Event = null): void {
        this.model.u.e("vodVideoContainer").style.width = "100%";
        this.model.u.e("vodVideoContainer").style.height = "100%";
        this.model.u.x("vodVideoContainer", Math.floor((G.stageWidth[this.model.idHeader].stageWidth - this.model.u.getWidth("vodVideoContainer"))/2));
        this.model.u.y("vodVideoContainer", Math.floor((G.stageHeight[this.model.idHeader].stageHeight - this.model.u.getHeight("vodVideoContainer"))/2));

        //snapshot
        this.snapshot.snapshot();
    }

    /**
     * video对象快照
     * @param event
     */
    private snapshotHandler(event: Event = null): void {
        this.snapshot.snapshot();
    }

    private playing(event: Event): void {
        if(this.model.playing) {
            this.model.u.display(this.video, "block");
        }
    }

    private playComplete(event: Event): void {
        D.d("Video 播放结束");
    }

    private loadingHandler(event: Event): void {
        if(this.sthIsWrong) {
            D.d("Video sth is wrong, ignores loading. issue: "+this.model.issue);
            return;
        }

        if(this.model.loading) {
            this.model.u.display(this.loading, "block");
        } else {
            this.model.u.display(this.loading, "none");

            //D.d("display of canvas is setting none from loadingHandler");
            this.model.u.display("vodCanvasContainer", "none");
        }
    }

    private sthWrong(event: Event): void {
        if(this.model.issue > 0) {
            D.d("Video sth wrong");
            this.sthIsWrong = true;
            this.model.u.display(this.loading, "none");
            this.model.u.display("vodCanvasContainer", "none");
            this.model.u.display(this.video, "none");
        } else {
            this.sthIsWrong = false;
        }
    }
}
