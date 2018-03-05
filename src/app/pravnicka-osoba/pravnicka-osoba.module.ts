/**
 * "Pravnicka osoba" feature module.
 */
import {NgModule} from '@angular/core';

import {CommonModule} from '../common/common.module';
import {DataService} from './data.service';
import {FeatureModule} from '../feature.module';
import {MenuComponent} from './menu.component';
import {OdpovedniZastupciComponent} from './odpovedni-zastupci.component';
import {OstatniComponent} from './ostatni.component';
import {PodnikatelComponent} from './podnikatel.component';
//import {PravnickaOsobaRoutingModule} from './pravnicka-osoba-routing.module';
import {ZivnostiComponent} from './zivnosti.component';
import {ZmenoveListyComponent} from './zmenove-listy.component';

@NgModule({
    declarations: [
        MenuComponent,
        OdpovedniZastupciComponent,
        OstatniComponent,
        PodnikatelComponent,
        ZivnostiComponent,
        ZmenoveListyComponent
    ],
    imports: [
        CommonModule,
        FeatureModule,
        //PravnickaOsobaRoutingModule
    ],
    providers: [
        DataService
    ]
})
export class PravnickaOsobaModule {
}
