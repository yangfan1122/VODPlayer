/**
 * Created by yangfan on 2016/7/27.
 */
export class E {
    public static IMG_LOADED: string = "IMG_LOADED";
    public static IMG_FAILED: string = "IMG_FAILED";

    public static IP_LOADED: string = "IP_LOADED";
    public static IP_FAILED: string = "IP_FAILED";
    public static IP_ALLOWED: string = "ip_allowed";
    public static IP_FORBIDDEN: string = "ip_forbidden";

    public static MOVIEINFO_LOADED: string = "MOVIEINFO_LOADED";
    public static MOVIEINFO_FAILED: string = "MOVIEINFO_FAILED";
    public static NO_SD: string = "NO_SD";
    public static NO_HD: string = "NO_HD";

    public static CHANGE_VOLUME: string = "change_volume";
    public static CHANGE_SCALE: string = "CHANGE_SCALE";
    public static CHANGE_QUALITY: string = "CHANGE_QUALITY";
    public static CLICK_DOCUMENT: string = "CLICK_DOCUMENT";
    public static SNAPSHOT: string = "SNAPSHOT";

    public static VIDEO_URL: string = "VIDEO_URL";
    public static PLAY_COMPLETE: string = "play_complete";
    public static PLAY_ING: string = "PLAY_ING";
    public static STH_WRONG: string = "STH_WRONG";
    public static REMOVE_COVER: string = "REMOVE_COVER";
    public static LOADING: string = "LOADING";
    public static COVER_URL: string = "COVER_URL";
    public static ALERT: string = "ALERT";
    // public static VR: string = "VR";
    public static VTYPE:string = "VTYPE";
    public static PLAYBACKRATE: string = "PLAYBACKRATE";
    public static DISPOSE:string = "DISPOSE";
    public static HLS_SRC:string = "HLS_SRC";
    public static HLS_MANIFEST_PARSED:string = "MANIFEST_PARSED";
    public static FLV_SRC:string = "FLV_SRC";

    public static LOAD_START: string = "loadstart";
    public static LOADED_METADATA: string = "loadedmetadata";
    public static DURATION_CHANGE: string = "durationchange";
    public static LOADED_DATA: string = "loadeddata";
    public static PROGRESS: string = "progress";
    public static CAN_PLAY: string = "canplay";
    public static CAN_PLAY_THROUGH: string = "canplaythrough";
    public static TIME_UPDATE: string = "timeupdate";
    public static PLAY: string = "play";
    public static PLAYING: string = "playing";
    public static PAUSE: string = "pause";
    public static ENDED: string = "ended";
    public static EMPTIED: string = "emptied";
    public static STALLED: string = "stalled";
    public static SEEKING: string = "seeking";
    public static SEEKED: string = "seeked";
    public static WAITING: string = "waiting";
    public static VOLUME_CHANGE: string = "volumechange";
    public static ERROR: string = "error";

    //Custom Event
    public dispatcher: Element = document.createElement("vodPlayerDispatcher");
    public dispatch(event: string): void {
        try {
            this.dispatcher.dispatchEvent(new Event(event));
        } catch (error) {
            let evt: Event = document.createEvent("HTMLEvents");
            evt.initEvent(event, false, true);
            this.dispatcher.dispatchEvent(evt);
        }
    }
}
