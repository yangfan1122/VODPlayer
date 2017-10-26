import {D} from "../../../../../D";
/**
 * Created by yangfan on 2016/8/11.
 */
export class Store {
    private storage: Storage;
    private enabled: boolean = true;
    private historyArr: string[] = [];
    private historyMax: number = 100;
    private HISTORY: string = "vod_history";//进度
    private QUALITY: string = "vod_quality";//清晰度
    private VOLUME: string = "vod_volume";//音量

    public constructor() {
        try {
            this.storage = localStorage;
        } catch (error) {
            D.d(error);
            this.enabled = false;
            return;
        }

        if(!this.storage.hasOwnProperty(this.HISTORY)) {
            this.historyArr = [];
        } else {
            let str: string = this.storage[this.HISTORY];
            this.historyArr = str.split("&");
        }
        if(!this.storage.hasOwnProperty(this.QUALITY)) {
            this.storage[this.QUALITY] = "sd";
        }
        if(!this.storage.hasOwnProperty(this.VOLUME)) {
            this.storage[this.VOLUME] = 1;
        }
    }

    /**
     *
     * @param data: JSON
     * {
     *   complete: false,
     *   sid:G.params.sid,
     *   time: 10,
     *   vid:G.params.vid,
     * }
     */
    public saveHistory(data: any): void {
        let i: number = 0;

        //替换URL中的&，避免影响JSON.parse
        let vidtemp:string = data.vid;
        let sidtemp:string = data.sid;
        for(i=0;i<vidtemp.length;i++) {
            if(vidtemp.substr(i, 1) === "&") {
               vidtemp = vidtemp.substr(0, i) + "$" + vidtemp.substr(i+1, vidtemp.length);
            }
        }
        for(i=0;i<sidtemp.length;i++) {
            if(sidtemp.substr(i, 1) === "&") {
                sidtemp = sidtemp.substr(0, i) + "$" + sidtemp.substr(i+1, sidtemp.length);
            }
        }
        data.vid = vidtemp;
        data.sid = sidtemp;

        let dataStr: string = "";//data的字符形式
        try {
            dataStr = JSON.stringify(data);
        } catch (error) {
            D.d("播放历史格式错误");
            return;
        }

        //对比查找相同条目删除
        for(i=0;i<this.historyArr.length;i++) {
            let vidtemp:string = "";
            try {
                vidtemp = JSON.parse(this.historyArr[i]).vid;
            } catch (error) {
                D.e(error+" //// "+this.historyArr[i]);
            }
            if(data.vid===vidtemp && data.sid===JSON.parse(this.historyArr[i]).sid) {
                this.historyArr.splice(i,1);
                break;
            }
        }
        if(this.historyArr.length>=this.historyMax) {
            this.historyArr.pop();
        }
        this.historyArr.unshift(dataStr);

        //拼成可存储的字符串
        let str: string = "";
        for(i = 0;i<this.historyArr.length;i++) {
            str += this.historyArr[i]+"&";
        }
        str = str.slice(0, str.length-1);
        this.storage[this.HISTORY] = str;
    }

    public saveQuality(quality: string): void {
        this.storage[this.QUALITY] = quality;
    }

    public saveVolume(volume: number): void {
        this.storage[this.VOLUME] = volume;
    }

    public getTime(sid: string, vid: string): number {
        if(!this.storage.hasOwnProperty(this.HISTORY)) {
            this.historyArr = [];
        } else {
            let str: string = this.storage[this.HISTORY];
            this.historyArr = str.split("&");
        }

        let json: any;
        for(let i: number=0;i<this.historyArr.length;i++) {
            try {
                json = JSON.parse(this.historyArr[i]);
            } catch (error) {
                continue;
            }
            if(json.sid === sid && json.vid === vid) {
                if(!isNaN(json.time)) {
                    return json.time;
                } else {
                    D.d("json.time is NaN");
                    return 0;
                }
            }
        }
        return 0;
    }

    public getVolume(): number {
        return Number(this.storage[this.VOLUME]);//本地存储对象值是字符
    }

    public getQuality(): string {
        return this.storage[this.QUALITY];
    }

}
