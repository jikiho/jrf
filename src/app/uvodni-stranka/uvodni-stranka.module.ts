/**
 * "Uvodni stranka" feature module.
 */
import {NgModule} from '@angular/core';

import {FeatureModule} from '../feature.module';
import {UvodniStrankaComponent} from './uvodni-stranka.component';
//import {UvodniStrankaRoutingModule} from './uvodni-stranka-routing.module';

@NgModule({
    declarations: [
        UvodniStrankaComponent
    ],
    imports: [
        FeatureModule,
        //UvodniStrankaRoutingModule
    ]
})
export class UvodniStrankaModule {
}
