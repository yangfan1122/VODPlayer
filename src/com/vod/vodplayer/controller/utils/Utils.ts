/**
 * Created by Administrator on 2017/7/4.
 */
export class Utils {
    public static isLocal(): boolean {
        return document.domain === "localhost";
    }
    public static rd(n:number, m:number):number {
        const c:number = m-n+1;
        return Math.floor(Math.random() * c + n);
    }
}