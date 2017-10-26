/**
 * Created by yangfan on 2016/7/8.
 *
 * 1.bowlder.js版本，删除编译后文件中VODPlayer模块define方法的第一个参数。
 * 2.alone版本，编译后文件中VODPlayer模块define方法的第一个参数，VODPlayer -> vodplayer。
 */
import {Main} from "./com/vod/vodplayer/Main";
export class VODPlayer {
    public constructor(container: HTMLElement, params: any) {
        const main: Main = new Main(container, params);
        main.init();
    }
}
