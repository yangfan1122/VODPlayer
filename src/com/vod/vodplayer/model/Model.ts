import {E} from "../E";
import {D} from "../../../../D";
import {U} from "../view/utils/U";
/**
 * Created by yangfan on 2016/7/27.
 */
export class Model extends E {

    private U:U;
    public set u(_u:U) {
        this.U = _u;
    }
    public get u():U {
        return this.U;
    }

    private IdHeader:string = "";
    public set idHeader(header:string) {
        this.IdHeader = header;
    }
    public get idHeader():string {
        return this.IdHeader;
    }

    //播放完成
    private PlayComplete: number = 0;
    public set playComplete(complete: number) {
        this.PlayComplete = complete;
        if(complete) {
            this.dispatch(E.PLAY_COMPLETE);
        }
    }
    public get playComplete(): number {
        return this.PlayComplete;
    }

    //播放中 view
    private Playing: boolean = false;
    public set playing(playing: boolean) {
        this.Playing = playing;
        this.dispatch(E.PLAY_ING);
    }
    public get playing(): boolean {
        return this.Playing;
    }

    ////播放中 controller
    //private StreamPlaying: boolean = false;
    //public set streamPlaying(playing: boolean) {
    //    this.StreamPlaying = playing;
    //    this.dispatch(E.PLAYING);
    //}
    //public get streamPlaying(): boolean {
    //    return this.StreamPlaying;
    //}

    //需要缓冲
    //用在展示loading图标
    private Loading: boolean = false;
    public set loading(w: boolean) {
        this.Loading = w;
        this.dispatch(E.LOADING);
    }
    public get loading(): boolean {
        return this.Loading;
    }

    //播放时间
    private Timeupdate: number = 0;
    public set timeupdate(time: number) {
        this.Timeupdate = time;
        this.dispatch(E.TIME_UPDATE);
    }
    public get timeupdate(): number {
        return this.Timeupdate;
    }

    //加载
    private Progress: number = 0;
    public set progress(p: number) {
        this.Progress = p;
        this.dispatch(E.PROGRESS);
    }
    public get progress(): number {
        return this.Progress;
    }

    //duration
    private Durantion: number = 0;
    public set duration(d: number) {
        this.Durantion = d;
        this.dispatch(E.DURATION_CHANGE);
    }
    public get duration(): number {
        return this.Durantion;
    }

    //跳转完成
    private Seeked: boolean = false;
    public set seeked(seeked: boolean) {
        this.Seeked = seeked;
        this.dispatch(E.SEEKED);
    }
    public get seeked(): boolean {
        return this.Seeked;
    }

    //音量变化
    private Volume: number = 0;//实际音量
    public set volume(v: number) {
        this.Volume = v;
        this.dispatch(E.VOLUME_CHANGE);
    }
    public get volume(): number {
        return this.Volume;
    }

    //画面比例
    private Scale: number = 0;
    public set scale(s: number) {
        this.Scale = s;
        this.dispatch(E.CHANGE_SCALE);
    }
    public get scale(): number {
        return this.Scale;//0默认 1四比三 2十六比九 3铺满
    }

    //清晰度: sd hd
    private Quality: string = "";
    public set quality(q: string) {
        this.Quality = q;
        this.dispatch(E.CHANGE_QUALITY);
    }
    public get quality(): string {
        return this.Quality;
    }

    //点击document
    private ClickDoc: string = "";
    public set clickDoc(src: string) {
        this.ClickDoc = src;
        this.dispatch(E.CLICK_DOCUMENT);
    }
    public get clickDoc(): string {
        return this.ClickDoc;
    }

    //截屏
    public set snapshot(shot: boolean) {
        if(shot) {
            this.dispatch(E.SNAPSHOT);
        }
    }

    //0配置文件错误，1版权，2未找到视频，3超时，4vr加载失败,
    //5参数错误(vid), 6不支持的视频源, 7不支持WebGL, 8hls库加载失败,
    //9flvjs库加载失败, 10硬件不支持
    private Issue: number = -1;
    public set issue(issue: number) {
        this.Issue = issue;
        this.dispatch(E.STH_WRONG);
    }
    public get issue(): number {
        return this.Issue;
    }

    //移除post 避免在切换清晰度时显示
    private RemoveCover: boolean = false;
    public set removeCover(rm: boolean) {
        this.RemoveCover = rm;
        this.dispatch(E.REMOVE_COVER);
    }
    public get removeCover(): boolean {
        return this.RemoveCover;
    }

    //封面图
    private CoverURL: string = "";
    public set coverURL(url: string) {
        this.CoverURL = url;
        this.dispatch(E.COVER_URL);
    }
    public get coverURL(): string {
        return this.CoverURL;
    }

    //缺少的清晰度
    private NoThisQuality: string = "";
    public set noThisQuality(q: string) {
        this.NoThisQuality = q;
        if(q === "sd") {
            this.dispatch(E.NO_SD);
        } else if(q === "hd") {
            this.dispatch(E.NO_HD);
        }
    }
    public get noThisQuality(): string {
        return this.NoThisQuality;
    }

    //Alert 最多15个汉字
    private AlertWindow: string = "";
    public set alertWindow(content: string) {
        this.AlertWindow = content;
        this.dispatch(E.ALERT);
    }
    public get alertWindow(): string {
        return this.AlertWindow;
    }

    //普通mp4:0 VR:1 HLS:2 Flv:3
    private VType: number = 0;
    public set vType(v: number) {
        this.VType = v;
        this.dispatch(E.VTYPE);
    }
    public get vType(): number {
        return this.VType;
    }

    //HLS video.src赋值
    private HlsSrc:string = "";
    public set hlsSrc(s:string) {
        this.HlsSrc = s;
        this.dispatch(E.HLS_SRC);
    }
    public get hlsSrc():string {
        return this.HlsSrc;
    }

    //flv video.src赋值
    private FlvSrc:string = "";
    public set flvSrc(src:string) {
        this.FlvSrc = src;
        this.dispatch(E.FLV_SRC);
    }
    public get flvSrc():string {
        return this.FlvSrc;
    }

    //播放速度
    private PlaybackRate: number = 1;
    public set playbackRate(rate: number) {
        this.PlaybackRate = rate;
        this.dispatch(E.PLAYBACKRATE);
    }
    public get playbackRate(): number {
        return this.PlaybackRate;
    }

    //释放
    private Dispose:boolean = false;
    public set dispose(d:boolean) {
        this.Dispose = d;
        this.dispatch(E.DISPOSE);
    }
    public get dispose():boolean {
        return this.Dispose;
    }
}
