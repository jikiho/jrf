/**
 * "Pravnicka osoba" feature module.
 */
import {NgModule} from '@angular/core';

import {CommonModule} from '../common/common.module';
import {ContentsService} from './contents.service';
import {DataService} from './data.service';
import {FeatureModule} from '../feature.module';
import {MenuComponent} from './menu.component';
import {OstatniComponent} from './ostatni.component';
import {PodnikatelComponent} from './podnikatel.component';
import {PodnikatelDataService} from './podnikatel-data.service';
//import {PravnickaOsobaRoutingModule} from './pravnicka-osoba-routing.module';
import {ZivnostiComponent} from './zivnosti.component';
import {ZmenoveListyComponent} from './zmenove-listy.component';

@NgModule({
    declarations: [
        MenuComponent,
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
        ContentsService,
        DataService,
        PodnikatelDataService
    ]
})
export class PravnickaOsobaModule {
}
