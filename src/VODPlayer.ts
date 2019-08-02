/**
 * Created by yangfan on 2016/7/8.
 */
import {Main} from "./com/vod/vodplayer/Main";
import '../styles/vodplayerstyle.css'

export class VODPlayer {
    public constructor(container: HTMLElement, params: any) {
        const main: Main = new Main(container, params);
        main.init();
    }
}
