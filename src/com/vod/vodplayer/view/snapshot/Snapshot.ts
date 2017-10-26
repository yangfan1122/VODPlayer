import {G} from "../../../../../G";
import {U} from "../utils/U";
import {Model} from "../../model/Model";
/**
 * Created by Administrator on 2017/5/15.
 */
export class Snapshot {
    private video:HTMLVideoElement;
    private model:Model;
    public constructor(v:HTMLVideoElement, m:Model) {
        this.video = v;
        this.model = m;
    }

    /**
     * video对象快照
     * @param event
     */
    public snapshot(event: Event = null): void {
        this.model.u.removeChildren("vodCanvasContainer");
        this.model.u.display("vodCanvasContainer", "block");
        let canvas: HTMLCanvasElement = document.createElement("canvas");//不能用new HTMLCanvasElement和new Canvas
        let context: CanvasRenderingContext2D = canvas.getContext("2d");
        let dWidth: number;
        let dHeight: number;
        if(this.video.videoWidth/this.video.videoHeight >= G.stageWidth[this.model.idHeader].stageWidth/G.stageHeight[this.model.idHeader].stageHeight) {
            dWidth = G.stageWidth[this.model.idHeader].stageWidth;
            dHeight = Math.floor(dWidth*this.video.videoHeight/this.video.videoWidth);
        } else {
            dHeight = G.stageHeight[this.model.idHeader].stageHeight;
            dWidth = Math.floor(dHeight*this.video.videoWidth/this.video.videoHeight);
        }
        canvas.width = G.stageWidth[this.model.idHeader].stageWidth;
        canvas.height = G.stageHeight[this.model.idHeader].stageHieght;
        let positionX: number = Math.floor((G.stageWidth[this.model.idHeader].stageWidth-dWidth)/2);
        let positionY: number = Math.floor((G.stageHeight[this.model.idHeader].stageHeight-dHeight)/2);
        context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, positionX, positionY, dWidth, dHeight);
        this.model.u.e("vodCanvasContainer").appendChild(canvas);
    }
}