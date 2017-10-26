import {D} from "../../../../../D";
import {G} from "../../../../../G";
import {Model} from "../../model/Model";
/**
 * Created by yangfan on 2016/8/9.
 */
export class CDN {
    private static pctArr: Array<number> = [];
    private static defaultPCTArr: Array<number> = [40, 20, 40];
    private static twoPCTArr: Array<number> = [50, 50];

    public static cdn(model:Model): void {
        if(G.movieInfo[model.idHeader].sdArr.length === 2 || G.movieInfo[model.idHeader].hdArr.length === 2) {
            this.pctArr = this.twoPCTArr;
        } else {
            this.pctArr = this.defaultPCTArr;
        }
        D.d("this.pctArr: "+this.pctArr);

        //N家随机
        let tempArr: Array<number> = [];//区间
        let tempArr1: Array<number> = [0];//临界点 [0, m, n...]
        for(let i: number=0;i<this.pctArr.length;i++) {
            tempArr.push(Number(this.pctArr[i]));
        }
        for(let j: number=0;j<tempArr.length-1;j++) {
            tempArr1.push(tempArr1[j]+tempArr[j]);
        }
        function r(): number {
            let r: number = Math.round(Math.random()*100);
            let no: number;
            if (r <= tempArr1[1]) {
                no = 0;
            } else if (r > tempArr1[tempArr1.length - 1]) {
                no = tempArr1.length - 1;
            } else {
                let len: number = tempArr1.length;
                for (let i: number = 1; i<(len-1); i++) {
                    if (r > tempArr1[i] && r <= tempArr1[i+1]) {
                        no = i;
                        break;
                    }
                }
            }
            return no;//比例数组为空时，返回0。
        }

        let m: number = r();//主流序号，网 蓝 快。
        let b: number;//备流序号
        if(tempArr.indexOf(100)>=0) {
            b = m;
        } else {
            while(true) {
                b=r();
                if(m!==b) {
                    break;
                }
            }
        }
        D.d("m:"+m+", b:"+b);

        if(G.movieInfo[model.idHeader].sdArr.length >= 2) {
            G.mURL.sd = G.movieInfo[model.idHeader].sdArr[m];
            G.bURL.sd = G.movieInfo[model.idHeader].sdArr[b];
        }
        if(G.movieInfo[model.idHeader].hdArr.length >= 2) {
            G.mURL.hd = G.movieInfo[model.idHeader].hdArr[m];
            G.bURL.hd = G.movieInfo[model.idHeader].hdArr[b];
        }

        D.d("主sd："+G.mURL.sd+", 主hd："+G.mURL.hd);
        D.d("备sd："+G.bURL.sd+", 备hd："+G.bURL.hd);

        //避免无vid sid时本地存数据错误
        G.params[model.idHeader].sid===""?G.params[model.idHeader].sid=G.mURL.sd:G.params[model.idHeader].sid;
        G.params[model.idHeader].vid===""?G.params[model.idHeader].vid=G.mURL.sd:G.params[model.idHeader].vid;
        D.d("sid: "+G.params[model.idHeader].sid);
        D.d("vid: "+G.params[model.idHeader].vid);
    }
}
