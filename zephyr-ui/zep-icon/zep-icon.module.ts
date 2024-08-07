import { NgModule } from "@angular/core";
import { ZepIcon } from "./zep-icon";
import { ZepIconService } from "./zep-icon.service";
import { provideHttpClient } from "@angular/common/http";


@NgModule({
    declarations: [],
    imports: [ZepIcon],
    exports: [ZepIcon],
    providers: [ZepIconService, provideHttpClient()]
})

export class ZepIconModule { }