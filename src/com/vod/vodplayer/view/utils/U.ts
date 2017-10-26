import {D} from "../../../../../D";
/**
 * Created by yangfan on 2016/7/30.
 */
export class U {
    private headerID:string;

    public constructor(_id:string) {
        this.headerID = _id+"_";
    }

    public e(id: string): HTMLElement {
        return document.getElementById(this.headerID+id);
    }

    public width(obj: any, width: number): void {
        if(typeof obj === "string") {
            this.e(obj).style.width = Math.round(width) + "px";
        } else {
            (obj as HTMLElement).style.width = Math.round(width) + "px";
        }
    }

    public height(obj: any, height: number): void {
        if(typeof obj === "string") {
            this.e(obj).style.height = Math.round(height) + "px";
        } else {
            (obj as HTMLElement).style.height = Math.round(height) + "px";
        }
    }

    public x(obj: any, left: number): void {
        if(typeof obj === "string") {
            this.e(obj.toString()).style.left = Math.round(left) + "px";
        } else {
            obj.style.left = Math.round(left) + "px";
        }
    }

    public y(obj: any, top: number): void {
        if(typeof obj === "string") {
            this.e(obj.toString()).style.top = Math.round(top) + "px";
        } else {
            obj.style.top = Math.round(top) + "px";
        }
    }

    public getX(obj: any): number {
        if(typeof obj === "string") {
            let x: number = Number(this.e(obj.toString()).style.left.split("px")[0]);
            return x;
        } else {
            return Number(obj.style.left.split("px")[0]);
        }
    }

    public getY(obj: any): number {
        if(typeof obj === "string") {
            let x: number = Number(this.e(obj.toString()).style.top.split("px")[0]);
            return x;
        } else {
            return Number(obj.style.top.split("px")[0]);
        }
    }

    public getWidth(element: any): number {
        if(typeof element === "string") {
            return Math.round(this.e(element).clientWidth);
        } else {
            return Math.round(element.clientWidth);
        }
    }

    public getHeight(element: any): number {
        if(typeof element === "string") {
            return Math.round(this.e(element).clientHeight);
        } else {
            return Math.round(element.clientHeight);
        }
    }

    public css(id: string, className: string): void {
        this.e(id).className = className;
    }

    public display(obj: any, dis: string): void {
        if(obj === undefined) {
            D.d("U.display, obj=undefined");
            return;
        }
        if(typeof obj === "string") {
            this.e(obj.toString()).style.display = dis;
        } else {
            obj.style.display = dis;
        }
    }

    public getDisplay(obj: any): string {
        if(typeof obj === "string") {
            return this.e(obj).style.display;
        } else {
            return obj.style.display;
        }
    }

    public removeChildren(obj: any): void {
        let children: any;
        if(typeof obj === "string") {
            children = this.e(obj.toString()).childNodes;
            for(let i: number=children.length-1;i>-1;i--) {
                this.e(obj.toString()).removeChild(children[0]);
            }
        } else {
            children = obj.childNodes;
            for(let i: number=children.length-1;i>-1;i--) {
                obj.removeChild(children[0]);
            }
        }
    }

    public formatTime(seconds: number): string {
        if(isNaN(seconds) || seconds <= 0) {
            return "00:00";
        }

        let minute: number = Math.floor(seconds / 60);
        let second: number = Math.floor(seconds % 60);
        let result: string = "";
        if(minute < 10) {
            result += "0";
        }
        result += minute;
        result += ":";
        if(second < 10) {
            result += "0";
        }
        result += second;
        return result;
    }
}
