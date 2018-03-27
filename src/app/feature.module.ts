/**
 * Feature shared module.
 */
import {NgModule} from '@angular/core';
import {Builder, Parser} from 'xml2js';

import {AppMenuComponent} from './app-menu.component';
import {CommonModule} from './common/common.module';
import {ContentToolbarComponent} from './content-toolbar.component';

/**
 * XML builder/parser.
 */
export const xmlBuilder = new Builder();

export const xmlParser = new Parser({
    explicitArray: false
});

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
