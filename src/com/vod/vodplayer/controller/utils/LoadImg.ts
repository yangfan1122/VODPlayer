import {E} from "../../E";
/**
 * Created by yangfan on 2016/7/25.
 */
export class LoadImg extends E {
    private img: HTMLImageElement;

    public constructor() {
        super();
        this.img = new Image();
        this.img.addEventListener("load", this.loaded.bind(this));
        this.img.addEventListener("error", this.error.bind(this));
    }

    public load(path: string): void {
        this.img.src = path;
    }

    public get image(): HTMLImageElement {
        return this.img;
    }

    private loaded(): void {
        this.dispatch(E.IMG_LOADED);
    }
    private error(): void {
        this.dispatch(E.IMG_FAILED);
    }
}
