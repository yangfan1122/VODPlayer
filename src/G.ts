/**
 * Created by yangfan on 2016/7/29.
 * 留意需要重复使用的静态属性
 */
export class G {
    public static version: string = "VODPlayer";
    public static channel: string = "vodplayer";

    public static stageWidth:any = {};
    public static stageHeight:any = {};
    public static params: any = {};
    public static movieInfo: any = {};
    public static mURL: any = {};//主
    public static bURL: any = {};//备
    public static onStage: boolean = false;
}