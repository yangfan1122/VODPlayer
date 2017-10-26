import {Model} from "../model/Model";
import {Controller} from "../controller/Controller";
import {E} from "../E";
import {U} from "./utils/U";
import {D} from "../../../../D";
import {LoadImg} from "../controller/utils/LoadImg";
import {G} from "../../../../G";
/**
 * Created by yangfan on 2016/9/6.
 */
export class Cover {
    private model: Model;
    private controller: Controller;
    private coverContainer: HTMLElement;
    private img: LoadImg;
    private originWidth: number;
    private originHeight: number;
    private tempImageHandler: any;
    private removed: boolean = false;//已收到移除命令就不再显示封面

    public constructor(m: Model, c: Controller) {
        this.model = m;
        this.controller = c;
        this.init();
    }

    public resize(): void {
        if(!this.img || isNaN(this.originWidth) || isNaN(this.originHeight)) {
            return;
        }

        let w: number;
        let h: number;
        if(this.originWidth/this.originHeight >= G.stageWidth[this.model.idHeader].stageWidth/G.stageHeight[this.model.idHeader].stageHeight) {
            w = G.stageWidth[this.model.idHeader].stageWidth;
            h = Math.floor(w*this.originHeight/this.originWidth);
        } else {
            h = G.stageHeight[this.model.idHeader].stageHeight;
            w = Math.floor(h*this.originWidth/this.originHeight);
        }
        this.model.u.width(this.img.image, w);
        this.model.u.height(this.img.image, h);
        this.model.u.x(this.img.image, Math.floor((G.stageWidth[this.model.idHeader].stageWidth-w)/2));
        this.model.u.y(this.img.image, Math.floor((G.stageHeight[this.model.idHeader].stageHeight-h)/2));
    }

    public set visible(show: boolean) {
        if(this.removed) {
            this.model.u.display(this.coverContainer, "none");
            return;
        }

        if(show) {
            this.model.u.display(this.coverContainer, "block");
        } else {
            this.model.u.display(this.coverContainer, "none");
        }
    }

    private init(): void {
        this.coverContainer = this.model.u.e("vodCoverContainer");
        this.model.dispatcher.addEventListener(E.COVER_URL, this.coverHandler.bind(this));
        this.model.dispatcher.addEventListener(E.REMOVE_COVER, this.removeCover.bind(this));
        this.model.dispatcher.addEventListener(E.STH_WRONG, this.sthWrong.bind(this));

        this.img = new LoadImg();
        this.tempImageHandler = this.imageHandler.bind(this);
        this.img.dispatcher.addEventListener(E.IMG_LOADED, this.tempImageHandler);
        this.img.dispatcher.addEventListener(E.IMG_FAILED, this.tempImageHandler);
    }

    /**
     * 加载封面图
     * @param event
     */
    private coverHandler(event: Event): void {
        this.img.load(this.model.coverURL);
    }

    private imageHandler(event: Event): void {
        this.img.dispatcher.removeEventListener(E.IMG_LOADED, this.tempImageHandler);
        this.img.dispatcher.removeEventListener(E.IMG_FAILED, this.tempImageHandler);
        this.tempImageHandler = null;

        if(event.type === E.IMG_LOADED) {
            this.originWidth = this.img.image.width;
            this.originHeight = this.img.image.height;
            this.coverContainer.appendChild(this.img.image);
            this.resize();
            this.visible = true;
        } else if(event.type === E.IMG_FAILED) {
            D.d("缩略图加载失败");
        }
    }

    /**
     * 移除封面
     * @param event
     */
    private removeCover(event: Event = null): void {
        this.removed = true;
        this.visible = false;
    }

    private sthWrong(event:Event):void {
        if(this.model.issue > 0) {
            this.removeCover();
        }
    }
}
