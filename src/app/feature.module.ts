/**
 * Feature shared module.
 */
import {NgModule} from '@angular/core';

import {AppMenuComponent} from './app-menu.component';
import {CommonModule} from './common/common.module';
import {ContentToolbarComponent} from './content-toolbar.component';

@NgModule({
    declarations: [
        AppMenuComponent,
        ContentToolbarComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AppMenuComponent,
        ContentToolbarComponent
    ]
})
export class FeatureModule {
}
