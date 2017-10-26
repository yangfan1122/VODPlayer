import {D} from "../../../../../D";
import {G} from "../../../../../G";
/**
 * Created by yangfan on 2016/8/8.
 */
export class MovieInfo {

    /**
     * 分析json数据
     * @param json 声明为JSON类型，后面使用会提示找不到属性all
     */
    public static analyse(json: any, idHeader:string): void {
        //视频地址
        let i: number = 0;
        let length: number = 0;
        let tempArr: Array<string> = [];
        let sdArr: Array<string> = [];
        let hdArr: Array<string> = [];
        try {
            tempArr = json.all.flvUrl.flv;
            length = json.all.flvUrl.flv.length;
        } catch(error) {
            tempArr = [];
            length = 0;
        }
        for(i=0;i<length;i++) {
            sdArr.push(tempArr[i]);
        }
        try {
            tempArr = json.all.hdUrl.flv;
            length = json.all.hdUrl.flv.length;
        } catch(error) {
            tempArr = [];
            length = 0;
        }
        for(i=0;i<length;i++) {
            hdArr.push(tempArr[i]);
        }

        G.movieInfo[idHeader].sdArr = sdArr;
        G.movieInfo[idHeader].hdArr = hdArr;

        //拼快网流
        if(G.params[idHeader].videoSource === "") {
            if((G.movieInfo[idHeader].sdArr.length>0&&G.movieInfo[idHeader].sdArr[0].indexOf("http://")>-1) || (G.movieInfo[idHeader].hdArr.length>0&&G.movieInfo[idHeader].hdArr[0].indexOf("http://")>-1)) {
                if(G.movieInfo[idHeader].sdArr.length>0 && !G.movieInfo[idHeader].sdArr[2]) {
                    if(G.movieInfo[idHeader].sdArr[0].indexOf("//flv.") > -1) {
                        G.movieInfo[idHeader].sdArr.push(G.movieInfo[idHeader].sdArr[0].slice(0, 10)+"5"+G.movieInfo[idHeader].sdArr[0].slice(10, G.movieInfo[idHeader].sdArr[0].toString().length));
                    }else if(G.movieInfo[idHeader].sdArr[0].indexOf("//flv4.") > -1) {
                        G.movieInfo[idHeader].sdArr.push(G.movieInfo[idHeader].sdArr[0].slice(0, 10)+"5"+G.movieInfo[idHeader].sdArr[0].slice(11, G.movieInfo[idHeader].sdArr[0].toString().length));
                    }
                }
                if(G.movieInfo[idHeader].hdArr.length>0 && !G.movieInfo[idHeader].hdArr[2]) {
                    if(G.movieInfo[idHeader].hdArr[0].indexOf("//flv.") > -1) {
                        G.movieInfo[idHeader].hdArr.push(G.movieInfo[idHeader].hdArr[0].slice(0, 10)+"5"+G.movieInfo[idHeader].hdArr[0].slice(10, G.movieInfo[idHeader].hdArr[0].toString().length));
                    }else if(G.movieInfo[idHeader].hdArr[0].indexOf("//flv4.") > -1) {
                        G.movieInfo[idHeader].hdArr.push(G.movieInfo[idHeader].hdArr[0].slice(0, 10)+"5"+G.movieInfo[idHeader].hdArr[0].slice(11, G.movieInfo[idHeader].hdArr[0].toString().length));
                    }
                }
            } else {
                if(G.movieInfo[idHeader].sdArr.length>0 && !G.movieInfo[idHeader].sdArr[2]) {
                    if(G.movieInfo[idHeader].sdArr[0].indexOf("//flv.") > -1) {
                        G.movieInfo[idHeader].sdArr.push(G.movieInfo[idHeader].sdArr[0].slice(0, 11)+"5"+G.movieInfo[idHeader].sdArr[0].slice(11, G.movieInfo[idHeader].sdArr[0].toString().length));
                    } else if(G.movieInfo[idHeader].sdArr[0].indexOf("//flv4.") > -1) {
                        G.movieInfo[idHeader].sdArr.push(G.movieInfo[idHeader].sdArr[0].slice(0, 11)+"5"+G.movieInfo[idHeader].sdArr[0].slice(12, G.movieInfo[idHeader].sdArr[0].toString().length));
                    }
                }
                if(G.movieInfo[idHeader].hdArr.length>0 && !G.movieInfo[idHeader].hdArr[2]) {
                    if(G.movieInfo[idHeader].hdArr[0].indexOf("//flv.") > -1) {
                        G.movieInfo[idHeader].hdArr.push(G.movieInfo[idHeader].hdArr[0].slice(0, 11)+"5"+G.movieInfo[idHeader].hdArr[0].slice(11, G.movieInfo[idHeader].hdArr[0].toString().length));
                    }else if(G.movieInfo[idHeader].hdArr[0].indexOf("//flv4.") > -1) {
                        G.movieInfo[idHeader].hdArr.push(G.movieInfo[idHeader].hdArr[0].slice(0, 11)+"5"+G.movieInfo[idHeader].hdArr[0].slice(12, G.movieInfo[idHeader].hdArr[0].toString().length));
                    }
                }
            }
        }

        D.d("流畅: "+sdArr);
        D.d("高清: "+hdArr);

        //vr，页面参数优先级高于视频信息xml
        if(G.params[idHeader].vr === "1") {
            G.movieInfo[idHeader].vtype = 1;//vr
        } else {
            let tempArr:string[];
            let extension:string = "";
            try {
                if(G.params[idHeader].videoSource && G.params[idHeader].videoSource !== "") {
                    tempArr = G.params[idHeader].videoSource.split("?")[0].split(".");
                } else {
                    tempArr = G.movieInfo[idHeader].sdArr[0].split("?")[0].split(".");
                }
                extension = tempArr[tempArr.length-1].toLowerCase();
            } catch (error) {
                D.w("MovieInfo, "+error);
            }
            if(extension === "m3u8") {
                G.movieInfo[idHeader].vtype = 2;//hls
            } else if(extension === "flv") {
                G.movieInfo[idHeader].vtype = 3;//flv
            } else {
                G.movieInfo[idHeader].vtype = 0;//mp4
            }
        }

        //title
        try {
            G.movieInfo[idHeader].title = decodeURIComponent(json.all.title);
        } catch (error) {
            G.movieInfo[idHeader].title = "";
        }
        D.d(G.movieInfo[idHeader].title);

        //duration
        try {
            G.movieInfo[idHeader].duration = json.all.totaltime;
        } catch(error) {
            G.movieInfo[idHeader].duration = 0;
        }
        D.d("G.movieInfo[idHeader].duration: "+G.movieInfo[idHeader].duration);

        //pageUrl
        try {
            G.movieInfo[idHeader].pageUrl = json.all.pageUrl;
        } catch(error) {
            G.movieInfo[idHeader].pageUrl = 0;
        }
        D.d(G.movieInfo[idHeader].pageUrl);

    }
}
