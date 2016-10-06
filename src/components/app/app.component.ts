import {Component, AfterViewInit} from "@angular/core";
import {getComponentTemplate} from "../../utilities/get-component-template.function";

@Component({
    selector: 'app',
    templateUrl: getComponentTemplate('app')
})
export class AppComponent {}