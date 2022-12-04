import { NgModule } from "@angular/core";
import { TuiTextfieldControllerModule, TuiButtonModule, TuiDropdownModule, TuiLinkModule, TuiExpandModule } from "@taiga-ui/core";
import {TuiInputModule} from '@taiga-ui/kit';
import {TuiActiveZoneModule} from '@taiga-ui/cdk';

@NgModule({
    exports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiLinkModule,
    TuiExpandModule
]})
export class TaigaModule{}