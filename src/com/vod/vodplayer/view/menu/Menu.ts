import {U} from "../utils/U";
import {D} from "../../../../../D";
import {G} from "../../../../../G";
import {Model} from "../../model/Model";
/**
 * Created by yangfan on 2016/8/18.
 */
export class Menu {
    private model:Model;

    public constructor(m:Model) {
        this.model = m;
    }

    public init(): void {
        let itemArr: any = this.model.u.e("vodMenu").getElementsByTagName("div");
        for (let i: number = 0; i < itemArr.length; i ++) {
            //移进移出样式
            itemArr[i].onmouseover = this.menuOver;
            itemArr[i].onmouseout = this.menuOut;
        }

        this.model.u.e("vodMenu").style.display = "none";
        document.oncontextmenu = this.onMenu.bind(this);
        document.onclick = this.onClick.bind(this);
    }

    /**
     * 移出item
     * @param event
     */
    private menuOver(event: Event): void {
        (event.currentTarget as HTMLElement).className = "active";
    }

    /**
     * 移入item
     * @param event
     */
    private menuOut(event: Event): void {
        (event.currentTarget as HTMLElement).className = "";
    }

    /**
     * 右键
     * @param e
     * @returns {boolean}
     */
    private onMenu(e: Event): boolean {
        if(!G.onStage) {
            return true;//移出舞台后不处理右键
        }

        let event: any = e || window.event;
        let style: any = this.model.u.e("vodMenu").style;

        style.display = "block";
        style.top = event.clientY + "px";
        style.left = event.clientX + "px";

        return false; // 取消默认行为
    }

    /**
     * 点击item
     * @param event
     */
    private onClick(event: Event): void {
        try {
            this.model.u.e("vodMenu").style.display = "none";
        } catch (error) {
            D.consolelog("Menu, "+error);
        }
    }
}
