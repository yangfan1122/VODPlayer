import {CDN} from "./params/CDN";
import {D} from "../../../../D";
import {E} from "../E";
import {G} from "../../../../G";
import {Model} from "../model/Model";
import {IPChecker} from "./ip/IPChecker";
import {LoadJSON} from "./utils/LoadJSON";
import {MovieInfo} from "./params/MovieInfo";
import {Stream} from "./Stream";
import {Store} from "./store/Store";
import {Utils} from "./utils/Utils";
import {Timer} from "./utils/Timer";
/**
 * Created by yangfan on 2016/7/27.
 */
export class Controller {
    public store: Store;
    private model: Model;
    private movieInfoURL: string;
    private loadJSON: LoadJSON = new LoadJSON();
    private ipChecker: IPChecker = new IPChecker();
    private info: any = {};
    private video: HTMLVideoElement;
    private stream: Stream;
    private _playbackRateDefault:string = "";//存储默认倍速，在Stream初始化后检查
    private tempHLSParsed:any;
    private setStartTimePointTemp:any;

    public constructor(m: Model) {
        this.model = m;
    }

    /**
     * 播放、暂停
     * @param play
     */
    public toggle(play: boolean): void {
        if(play) {
            this.playVideo();
        } else {
            this.pauseVideo();
        }
    }

    /**
     * 跳转
     * @param pct
     */
    public seek(pct: number): void {
        this.seekVideo(pct);
    }

    /**
     * 播放历史
     * @param time 秒
     * @param complete
     */
    public storage(time: number, complete: boolean = false): void {
        D.d("存播放历史, time="+time);
        this.store.saveHistory({
            complete: complete,
            sid: G.params[this.model.idHeader].sid,
            time: Math.floor(time),
            vid: G.params[this.model.idHeader].vid,
        });
    }

    /**
     * 改变音量
     * @param pct
     */
    public volume(pct: number): void {
        const volume: number = Math.floor(pct*10)/10;
        D.d("controller, volume = "+volume+", pct="+pct);
        this.model.volume = volume;
        this.store.saveVolume(volume);
    }

    /**
     * 画面尺寸，无法实现。
     * @param size 0-默认 1-4:3 2-16:9 3-铺满
     */
    public changeVideoScale(size: number): void {
        this.model.scale = size;
    }

    /**
     * 清晰度
     * @param q: sd hd
     */
    public changeVideoQuality(q: string): void {
        D.d("改变清晰度存历史, this.stream.time="+this.stream.time);
        this.storage(this.stream.time);

        this.model.quality = q;//View
        this.store.saveQuality(q);//LocalStorage
        this.model.snapshot = true;//快照
        this.setVideoSource();//Controller
    }

    /**
     * 点击document
     * @param src
     */
    public clickDocument(src: string): void {
        this.model.clickDoc = src;
    }

    /**
     * 播放结束
     */
    public playComplete(): void {
        this.storage(0, true);
        this.model.playComplete = 1;

        if(G.params[this.model.idHeader].loop === "1") {
            this.playVideo();
        }
    }

    /**
     * 播放速度
     * @param rate
     */
    public playbackRate(rate: number): void {
        this.model.playbackRate = rate;
    }

    /**
     * ****************** 入口 ******************
     */
    public init(): void {
        // this.video = U.e("vodVideo") as HTMLVideoElement;
        this.video = this.model.u.e("vodVideo") as HTMLVideoElement;
        this.stream = new Stream(this.video, this.model, this);

        //本地数据
        this.store = new Store();
        this.stream.history = this.store.getTime(G.params[this.model.idHeader].sid, G.params[this.model.idHeader].vid);
        if(G.params[this.model.idHeader].muted === "1") {
            this.volume(0);
        } else {
            D.d("this.store.getVolume() = "+this.store.getVolume());
            this.model.volume = this.store.getVolume();
        }
        this.model.quality = this.store.getQuality();
        D.d("播放历史: "+this.stream.history);

        //TODO: IPchecker CORS
        //this.checkip();

        this.movieInfo();

        //设置默认倍速
        if(this.playbackRateDefault !== "") {
            this.playbackRate(Number(this.playbackRateDefault));
        }
    }

    /**
     * check ip
     */
    private checkip(): void {
        this.ipChecker.dispatcher.addEventListener(E.IP_ALLOWED, this.checkipHandler.bind(this));
        this.ipChecker.dispatcher.addEventListener(E.IP_FORBIDDEN, this.checkipHandler.bind(this));
        this.ipChecker.check(this.model);
    }
    private checkipHandler(event: Event): void {
        this.ipChecker.dispatcher.removeEventListener(E.IP_ALLOWED, this.checkipHandler.bind(this));
        this.ipChecker.dispatcher.removeEventListener(E.IP_FORBIDDEN, this.checkipHandler.bind(this));

        if(event.type === E.IP_ALLOWED) {
            this.movieInfo();
        } else if(event.type === E.IP_FORBIDDEN) {
            this.model.issue = 1;
        }
    }

    /**
     * 视频信息
     */
    private movieInfo(): void {
        if(G.params[this.model.idHeader].videoSource!=="") {
            D.d("videoSource = "+G.params[this.model.idHeader].videoSource);
            this.loadJSON.setVideoJSON(G.params[this.model.idHeader].videoSource);
            this.movieInfoHandler();
        } else {
            this.model.issue = 5;
        }
    }
    private movieInfoHandler(event?: Event): void {
        if(event === undefined || event.type === E.MOVIEINFO_LOADED) {
            this.info = this.loadJSON.data;
            //D.d("JSON: "+JSON.stringify(this.info));
            MovieInfo.analyse(this.info, this.model.idHeader);
            if(G.movieInfo[this.model.idHeader].sdArr.length === 0) {
                this.model.noThisQuality = "sd";
                this.model.quality = "hd";
                this.store.saveQuality("hd");
            } else if(G.movieInfo[this.model.idHeader].hdArr.length === 0) {
                this.model.noThisQuality = "hd";
                this.model.quality = "sd";
                this.store.saveQuality("sd");
            }
            this.vtype();
            this.cdn();
            this.setVideoSource();
            this.checkAuto();
        } else if(event.type === E.MOVIEINFO_FAILED) {
            this.model.issue = 0;
        }
    }

    /**
     * 设置视频源
     */
    private setVideoSource(): void {
        if(this.model.quality === "sd") {
            this.stream.setSource(G.mURL.sd);
        } else if(this.model.quality === "hd") {
            this.stream.setSource(G.mURL.hd);
        }
        this.stream.history = this.store.getTime(G.params[this.model.idHeader].sid, G.params[this.model.idHeader].vid);
    }

    /**
     * 视频类型
     */
    private vtype(): void {
        this.model.vType = Number(G.movieInfo[this.model.idHeader].vtype);
    }

    /**
     * CDN
     */
    private cdn(): void {
        CDN.cdn(this.model);
    }

    /**
     * 自动播放
     */
    private checkAuto(): void {
        if(G.params[this.model.idHeader].autoplay === "true" || G.params[this.model.idHeader].autoplay === true) {
            //TODO:广告组件
            //this.adStart();
            this.adComplete();
        } else {
            D.d("封面图");
            this.model.coverURL = G.params[this.model.idHeader].coverpic;


            this.setStartTimePointTemp = this.setStartTimePoint.bind(this);
            this.model.dispatcher.addEventListener(E.DURATION_CHANGE, this.setStartTimePointTemp);
        }
    }

    private setStartTimePoint(event?:Event):void {
        this.model.dispatcher.removeEventListener(E.DURATION_CHANGE, this.setStartTimePointTemp);
        this.setStartTimePointTemp = null;

        //手动播放时，按需根据参数设置开始时间
        const starttime:string = G.params[this.model.idHeader].starttime;
        const ap:any = G.params[this.model.idHeader].autoplay;
        if((ap === "false" || ap === false) && starttime !== "") {

            //多个相同URL的视频在极短时间内seek，在seeked状态里，video.currentTime值相同
            const rd:number = Utils.rd(1, 2);
            let timerDelay:Timer = new Timer(function():void {
                timerDelay.stop();
                timerDelay = null;
                D.d("跳转至默认开始时间, starttime="+G.params[this.model.idHeader].starttime+", rd="+rd);
                this.seekVideo(Number(starttime)/this.model.duration);
            }.bind(this), rd);
            timerDelay.start();

        }
    }

    /**
     * 广告
     */
    private adPlay(): void {

    }
    private adStart(): void {
        this.loadVideo();
    }
    private adComplete(): void {
        if(this.model.vType === 2) {
            //等待manifest解析完成
            this.tempHLSParsed = this.hlsParsed.bind(this);
            this.model.dispatcher.addEventListener(E.HLS_MANIFEST_PARSED, this.tempHLSParsed);
        } else {
            this.playVideo();
        }
    }
    private hlsParsed(event?:Event):void {
        this.model.dispatcher.removeEventListener(E.HLS_MANIFEST_PARSED, this.tempHLSParsed);
        this.tempHLSParsed = null;
        this.playVideo();
    }

    /**
     * 预加载视频
     */
    private loadVideo(): void {
        this.video.load();
    }

    /**
     * 播放视频
     */
    private playVideo(): void {
        this.stream.play();
    }

    /**
     * 暂停视频
     */
    private pauseVideo(): void {
        this.stream.pause();
    }

    /**
     * 跳转
     * @param pct
     */
    private seekVideo(pct: number): void {
        this.stream.seek(pct);
    }


    public set playbackRateDefault(rate:string) {
        this._playbackRateDefault = rate;
    }
    public get playbackRateDefault():string {
        return this._playbackRateDefault;
    }

}
