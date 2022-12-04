import { NgModule } from "@angular/core";
import { TuiTextfieldControllerModule, TuiButtonModule, TuiDropdownModule, TuiLinkModule, TuiExpandModule, TuiPrimitiveCheckboxModule } from "@taiga-ui/core";
import {TuiInputModule, TuiIslandModule} from '@taiga-ui/kit';
import {TuiActiveZoneModule} from '@taiga-ui/cdk';

@NgModule({
    exports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiLinkModule,
    TuiExpandModule,
    TuiIslandModule,
    TuiPrimitiveCheckboxModule
]})
export class TaigaModule{}