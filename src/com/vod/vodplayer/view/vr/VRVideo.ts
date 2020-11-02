import {Utils} from "../../controller/utils/Utils";
declare function require(moduleNames: string[], onLoad: (...args: any[]) => void, onError: (...args: any[]) => void): void;
declare let bowlder: any;
import {Controller} from "../../controller/Controller";
import {D} from "../../../../../D";
import {G} from "../../../../../G";
import {Model} from "../../model/Model";
import {U} from "../utils/U";

/**
 * Created by yangfan on 2016/10/9.
 */
export class VRVideo {
    private model: Model;
    private controller: Controller;
    private video: HTMLVideoElement;
    private scene: any;
    private camera: any;
    private renderer: any;
    private sphere: any;
    private mesh: any;
    private texture: any;
    private requestAnimationId: number = -1;
    private thisTime: number = -1;
    private controls: any;

    public constructor(m: Model, c: Controller, v: HTMLVideoElement) {
        this.model = m;
        this.controller = c;
        this.video = v;

        this.init();
    }

    public resize(): void {
        let canvas: HTMLCanvasElement;
        try {
            canvas = this.renderer.domElement;
        } catch(error) {
            return;
        }
        this.camera.aspect = G.stageWidth[this.model.idHeader].stageWidth/G.stageHeight[this.model.idHeader].stageHeight;
        this.model.u.width(canvas, G.stageWidth[this.model.idHeader].stageWidth);
        this.model.u.height(canvas, G.stageHeight[this.model.idHeader].stageHeight);
    }

    private init(): void {
        this.video.setAttribute("crossorigin", "anonymous");

        let self: VRVideo = this;
        let threePath: string = "";
        if(G.params[this.model.idHeader].threeJSPath) {
            threePath = G.params[this.model.idHeader].threeJSPath
        } else {
            D.w('three.js path is empty')
        }
        let loadModel: any;
        try {
            loadModel = bowlder.run;
        } catch (error) {
            const w: any = window
            loadModel = require || w.require;
        }
        loadModel([threePath], (THREE: any) => {
            this.model.u.display(self.video, "none");
            self.thisTime = (new Date()).getTime();

            self.scene = new THREE.Scene();

            self.camera = new THREE.PerspectiveCamera(50, G.stageWidth[this.model.idHeader].stageWidth/G.stageHeight[this.model.idHeader].stageHeight, .1, 1000);
            self.camera.position.set(-90, 15, 0);

            //self.renderer = Detector.webgl?new THREE.WebGLRenderer():new THREE.CanvasRenderer();
            //self.renderer = this.webGLDetector()?new THREE.WebGLRenderer():new THREE.CanvasRenderer();
            if(this.webGLDetector()) {
                self.renderer = new THREE.WebGLRenderer();
            } else {
                this.model.issue = 7;
                D.e("WebGL is unsupported!");
                return;
            }
            self.renderer.setSize(G.stageWidth[this.model.idHeader].stageWidth, G.stageHeight[this.model.idHeader].stageHeight);
            self.renderer.autoClear = false;
            self.renderer.setClearColor(0x333333, 1);

            this.model.u.e("vodVRContainer").appendChild(self.renderer.domElement);
            this.model.u.height("vodVRContainer", G.stageHeight[this.model.idHeader].stageHeight);

            self.renderer.domElement.addEventListener("mousewheel", self.onMouseWheel.bind(self), false );

            self.texture = new THREE.Texture(self.video);
            self.texture.generateMipmaps = false;
            self.texture.minFilter = THREE.LinearFilter;
            self.texture.magFilter = THREE.LinearFilter;
            self.texture.format = THREE.RGBFormat;

            self.sphere = new THREE.SphereGeometry(Math.floor(G.stageWidth[this.model.idHeader].stageWidth/2), 80, 80);
            self.mesh = new THREE.Mesh(self.sphere, new THREE.MeshBasicMaterial({map: self.texture}));
            self.mesh.scale.x = -1;
            self.scene.add(self.mesh);

            self.animate();

            self.controls = new THREE.OrbitControls(self.camera, self.renderer.domElement);
        }, (error: any) => {
            D.e(error);
            self.controller.toggle(false);
            self.model.issue = 4;
        });
    }

    /**
     * 滚轮事件
     * event.wheelDelta, <0向下 >0向上
     * @param event
     */
    private onMouseWheel(event: WheelEvent): void {
        // if(event.wheelDelta < 0 && this.controls.spherical.radius > Math.floor(G.stageWidth[this.model.idHeader].stageWidth/2)) {
        //     this.controls.enableZoom = false;
        // } else if(event.wheelDelta > 0) {
        //     this.controls.enableZoom = true;
        // }
        console.warn('TODO: WheelEvent.wheelDelta')
    }

    private animate(): void {
        this.requestAnimationId = requestAnimationFrame(this.animate.bind(this));

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            if (typeof(this.texture) !== "undefined") {
                let ct: any = new Date().getTime();
                if (ct - this.thisTime >= 30) {
                    this.texture.needsUpdate = true;
                    this.thisTime = ct;
                }
            }
        }

        this.camera.updateProjectionMatrix();
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    private webGLDetector(): boolean {
        try {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            if ((window as any).WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))) {
                // window as any, 避免TSLint报错。
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

}
