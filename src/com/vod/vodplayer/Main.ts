import {Model} from "./model/Model";
import {View} from "./view/View";
import {Controller} from "./controller/Controller";
import {G} from "../../../G";
import {D} from "../../../D";
import {Params} from "./controller/params/Params";
/**
 * Created by yangfan on 2016/7/22.
 */
export class Main {
    private container: HTMLElement;
    private params: any;
    private view: View;
    private model: Model;
    private controller: Controller;

    public constructor(container: HTMLElement, params: Object) {
        this.container = container;
        this.params = params;
    }

    public init(): void {
        Params.init(this.params, this.container.id);

        this.model = new Model();
        this.controller = new Controller(this.model);
        this.view = new View(this.model, this.controller, this.container);
    }

}
