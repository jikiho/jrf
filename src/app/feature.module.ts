/**
 * Feature shared module.
 */
import {NgModule} from '@angular/core';

import {AppMenuComponent} from './app-menu.component';
import {CommonModule} from './common/common.module';

@NgModule({
    declarations: [
        AppMenuComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AppMenuComponent
    ]
})
export class FeatureModule {
}
