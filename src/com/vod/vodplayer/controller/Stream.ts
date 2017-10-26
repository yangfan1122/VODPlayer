import {E} from "../E";
import {D} from "../../../../D";
import {Model} from "../model/Model";
import {Controller} from "./Controller";
import {G} from "../../../../G";
import {Timer} from "./utils/Timer";
import {Stat} from "./stat/Stat";
import {U} from "../view/utils/U";
/**
 * Created by yangfan on 2016/8/11.
 */
export class Stream extends E {
    public history: number = 0;
    private video: HTMLVideoElement;
    private model: Model;
    private controller: Controller;
    private firstMetadata: boolean = true;
    private firstPlay:boolean = true;
    private promise: any;//[object Promise]
    private isLoading: boolean = false;//除首次播放seek(历史记录)时，其他同model.loading。
    private loadingCount: number = 0;
    private prevTime: number = 0;
    private timer: Timer;//缓冲、重连
    private heartbeatTimer: Timer;//心跳
    private reConnTime: number = 1;//const?
    private reConnCounter: number = 0;
    private startLoadTime: number = 0;
    private rate: number = 1;
    private stat:Stat;
    private bf: number = -1;//加载时长
    private lastHistoryTime:number = 0;
    private defaultPauseAlready:boolean = false;

    public constructor(video: HTMLVideoElement, m: Model, c: Controller) {
        super();
        this.model = m;
        this.controller = c;
        this.video = video;
        this.stat = new Stat(this.model);
        this.video.addEventListener(E.LOAD_START, this.status.bind(this));
        this.video.addEventListener(E.ERROR, this.status.bind(this));
        this.video.addEventListener(E.LOADED_METADATA, this.status.bind(this));
        this.video.addEventListener(E.DURATION_CHANGE, this.status.bind(this));
        this.video.addEventListener(E.LOADED_DATA, this.status.bind(this));
        this.video.addEventListener(E.PROGRESS, this.status.bind(this));
        this.video.addEventListener(E.CAN_PLAY, this.status.bind(this));
        this.video.addEventListener(E.CAN_PLAY_THROUGH, this.status.bind(this));
        this.video.addEventListener(E.TIME_UPDATE, this.status.bind(this));
        this.video.addEventListener(E.PLAY, this.status.bind(this));
        this.video.addEventListener(E.PLAYING, this.status.bind(this));
        this.video.addEventListener(E.PAUSE, this.status.bind(this));
        this.video.addEventListener(E.ENDED, this.status.bind(this));
        this.video.addEventListener(E.EMPTIED, this.status.bind(this));
        this.video.addEventListener(E.SEEKING, this.status.bind(this));
        this.video.addEventListener(E.SEEKED, this.status.bind(this));
        this.video.addEventListener(E.WAITING, this.status.bind(this));
        this.video.addEventListener(E.VOLUME_CHANGE, this.status.bind(this));
        this.model.dispatcher.addEventListener(E.VOLUME_CHANGE, this.volumeChanged.bind(this));
        this.model.dispatcher.addEventListener(E.PLAYBACKRATE, this.rateHandler.bind(this));
        this.model.dispatcher.addEventListener(E.DISPOSE, this.disposeHandler.bind(this));

        this.timer = new Timer(this.timerHandler.bind(this), 500);
    }

    public setSource(src: string): void {
        D.d("Stream.setSource, src = "+src);
        if(!this.timer.running) {
            this.timer.start();
        }

        if(this.video.src === src) {
            return;
        }
        // if(this.model.playing) {
        //     this.pause();
        // }//此处暂停，下面判断this.model.playing时始终为false，无法连贯播放
        // this.firstMetadata = true;
        this.firstPlay = true;
        this.startLoadTime = (new Date()).getTime();
        if(this.model.vType === 2) {
            D.d("HLS赋值新地址");
            this.model.hlsSrc = src;
        } if(this.model.vType === 3) {
            D.d("flv赋值新地址");
            this.model.flvSrc = src;
        } else {
            this.video.src = src;
        }
        if(this.model.playing) {
            this.play();
        }
    }

    public play(): void {
        this.model.loading = true;
        this.isLoading = true;
        this.model.playComplete = 0;
        this.model.playing = true;
        this.model.issue = -1;
        this.model.removeCover = true;

        if(!this.timer.running) {
            this.timer.start();
        }

        D.d("video.play()");
        this.promise = this.video.play();//It returns undefined in IE.
        if(this.promise !== undefined) {
            this.promise.then(this.playResolve, this.playReject.bind(this));
        }
    }
    public pause(): void {
        this.model.loading = false;//暂停时不显示loading
        this.model.playing = false;

        this.video.pause();
    }
    public seek(pct: number): void {
        let time: number = Math.floor(pct*this.video.duration);
        try {
            D.d("Stream.seek: "+time);
            this.video.currentTime = time;
        } catch (error) {
            D.e("Stream.seek, "+error+" // "+pct*this.video.duration);
            return;
        }

        this.model.seeked = false;
        if(!this.firstPlay) {
            this.model.loading = true;
        }
        this.isLoading = true;

        D.d("跳转存历史, time="+time);
        this.controller.storage(time);
    }

    public get time(): number {
        return this.video.currentTime;
    }

    public get duration(): number {
        return this.video.duration;
    }

    /**
     * 播放状态
     * 主动触发的动作（播放、暂停、跳转）对应的界面状态不在status中更新，慢，和主观操作有冲突。
     * @param event
     */
    private status(event: Event): void {
        // console.warn(event.type);
        if(event.type === E.CAN_PLAY) {
            this.model.loading = false;
        } else if(event.type === E.CAN_PLAY_THROUGH) {
            this.model.loading = false;
            if(this.bf < 0) {
                this.bf = (new Date()).getTime() - this.startLoadTime;
                D.d("视频加载时间: this.bf="+this.bf+" ms");
            }
        } else if(event.type === E.PLAY) {
            if(this.firstPlay) {
                this.stat.playStart(this.video.src, this.bf, this.model.quality);
                this.firstPlay = false;
            }
        } else if(event.type === E.LOADED_METADATA) {
            if((G.params[this.model.idHeader].autoplay==="true" || G.params[this.model.idHeader].autoplay === true)) {
                D.d("LOADED_METADATA, this.history="+this.history);
                this.video.currentTime = this.history;
            }
            this.video.currentTime = this.history;
            G.movieInfo[this.model.idHeader].duration = this.video.duration;
            D.d("metadata duration: "+G.movieInfo[this.model.idHeader].duration);
        } else if(event.type === E.PROGRESS) {
            this.progressHandler();
        } else if(event.type === E.TIME_UPDATE) {
            this.timeupdateHandler();
        } else if(event.type === E.SEEKED) {
            D.d("SEEKED, currentTime="+this.video.currentTime+", starttime="+G.params[this.model.idHeader].starttime);
            this.model.seeked = true;
            this.model.loading = false;
        } else if(event.type === E.SEEKING) {

        } else if(event.type === E.VOLUME_CHANGE) {

        } else if(event.type === E.PLAYING) {
            this.model.loading = false;
            this.video.playbackRate = this.rate;
        } else if(event.type === E.PAUSE) {

        } else if(event.type === E.WAITING) {
            this.model.loading = true;
        } else if(event.type === E.ERROR) {
            if(this.reConnCounter++ < this.reConnTime) {
                if(this.model.quality === "sd") {
                    this.setSource(G.bURL.sd);
                } else if(this.model.quality === "hd") {
                    this.setSource(G.bURL.hd);
                }
            } else {
                this.stat.videoFailed(this.video.src, this.model.quality);
                this.model.issue = 2;
            }
        } else if(event.type === E.ENDED) {
            this.stat.playComplete(this.model.quality);
            if(this.timer.running) {
                this.timer.stop();
            }
            this.history = 0;
            this.controller.playComplete();
        } else if(event.type === E.DURATION_CHANGE) {
            //心跳 统计
            if(this.heartbeatTimer && this.heartbeatTimer.running) {
                this.heartbeatTimer.stop();
                this.heartbeatTimer = null;
            }

            //计算统计间隔
            let heartbeatInterval = Math.floor(this.video.duration * 0.05);
            if(heartbeatInterval < 1) {
                heartbeatInterval = 1;
            } else if(heartbeatInterval > 180) {
                heartbeatInterval = 180;
            }
            D.d("心跳间隔"+heartbeatInterval+"秒");
            heartbeatInterval = heartbeatInterval * 1000; //转换为毫秒
            this.heartbeatTimer = new Timer(this.heartbeatHandler.bind(this), heartbeatInterval);
            this.heartbeatTimer.start();

            this.model.duration = this.duration;
        }
    }

    //play Promise callback
    private playResolve(value: any): void {
        D.d("play resolve, "+value);
    }
    private playReject(value: any): void {
        D.consolelog("play reject, "+value)

        if(String(value).indexOf("NotSupportedError") > -1) {
            this.model.issue = 6;
        } else if(String(value).indexOf("AbortError") > -1) {

        } else {
            this.model.issue = 2;
        }

        //TODO:待观察
        //play reject, value=NotSupportedError: Failed to load because no supported source was found.
        //可能由跨域引起

        // AbortError: The play() request was interrupted by a call to pause().
        // 强制调用了video.pause()。
    }
    /**
     * 心跳
     */
    private heartbeatHandler(): void {
        this.stat.heartbeat(this.time, this.model.quality);
    }

    private timerHandler(): void {
        if(this.video.paused) {
            return;
        }

        if(isNaN(this.video.currentTime)) {
            D.d("video.currentTime is NaN");
            this.model.loading = true;
            this.isLoading = true;
            return;
        }
        if(this.isLoading) {
            this.loadingCount++;

            let times:number = 0;
            if(this.model.vType === 2) {
                times = 200;
            } else {
                times = 20;
            }
            if(this.loadingCount === times) {
                this.pause();
                D.d("重新播放");
                this.play();
            } else if(this.loadingCount === times*2) {
                this.pause();
                this.timer.stop();
                this.loadingCount = 0;
                this.model.issue = 3;//超时
                D.d("超时");
                return;
            }
        } else {
            this.loadingCount = 0;
        }
        if(this.prevTime === this.video.currentTime && this.video.currentTime !== 0) {
            if(this.isLoading) {
                return;
            }
            this.isLoading = true;
            this.model.loading = true;
            this.stat.buffer(this.time, this.model.quality);//缓冲统计
        } else if(this.prevTime !== this.video.currentTime && this.video.currentTime > 0) {
            if(this.isLoading) {
                this.model.loading = false;
                this.isLoading = false;
            }
        }
        this.prevTime = this.video.currentTime;

        //存历史 每5秒存一次
        const now:number = Math.floor((new Date()).getTime()/1000);
        if((now-this.lastHistoryTime>2) && now%5 === 0 && this.video.duration>600) {
            let complete: boolean = (this.video.currentTime>(this.video.duration-5));
            this.controller.storage(Math.floor(this.time), complete);
            this.lastHistoryTime = now;
        }

        //默认暂停时间
        if(!this.defaultPauseAlready) {
            const ap:any = G.params[this.model.idHeader].autoplay;
            if((ap === "false" || ap === false) && G.params[this.model.idHeader].endtime!=="0" && (this.time >= Number(G.params[this.model.idHeader].endtime))) {
                this.controller.toggle(false);
                this.defaultPauseAlready = true;
            }
        }
    }

    /**
     * 加载进度
     */
    private progressHandler(): void {
        let loadeds: any[] = [];
        let width: number = 0;
        let left: number = 0;
        let start: number = 0;
        let end: number = 0;
        for (let i: number = 0; i < this.video.buffered.length; i++) {
            start = this.video.buffered.start(i);
            end = this.video.buffered.end(i);
            left = start / this.video.duration;
            width = (end - start) / this.video.duration;
            loadeds.push({
                end,
                left,
                width,
            });
        }
        if(loadeds.length>=1) {
            this.model.progress = loadeds[loadeds.length-1].end/this.duration;
        }
    }

    /**
     * 播放进度
     */
    private timeupdateHandler(): void {
        let pct: number = this.video.currentTime / this.video.duration;
        this.model.timeupdate = pct;
    }

    /**
     * 音量
     * @param event
     */
    private volumeChanged(event: Event): void {
        if(this.model.volume > 0) {
            this.video.muted = false;
        }
        if(this.model.volume > 1) {
            this.video.volume = 1;
        } else {
            try {
                this.video.volume = this.model.volume;
            } catch (error) {
                D.d(error+", this.model.volume="+this.model.volume);
            }
        }
    }

    /**
     * 播放速度
     * @param event
     */
    private rateHandler(event?: Event): void {
        this.playRate(this.model.playbackRate);
    }
    private playRate(rate: number): void {
        this.rate = rate;
        if(!this.video.paused) {
            this.video.playbackRate = rate;
        }
    }

    private disposeHandler(event:Event):void {
        if(this.model.dispose) {
            if(this.timer.running) {
                D.d("Stream dispose");
                this.timer.stop();
            }

            // 可以停止加载，但该播放器实例如不重新为video.src赋值将无法继续使用。
            // this.video.src = "";
            // this.video.removeAttribute("src");
        }
    }
}
