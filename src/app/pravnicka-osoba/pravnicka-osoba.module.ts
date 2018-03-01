/**
 * "Pravnicka osoba" feature module.
 */
import {NgModule} from '@angular/core';

import {CommonModule} from '../common/common.module';
import {MenuComponent} from './menu.component';
import {PodnikatelComponent} from './podnikatel.component';
import {RoutingModule} from './routing.module';
import {ZivnostiComponent} from './zivnosti.component';

@NgModule({
    declarations: [
        MenuComponent,
        PodnikatelComponent,
        ZivnostiComponent
    ],
    imports: [
        CommonModule,
        RoutingModule,
    ],
    providers: [
        //data service
    ]
})
export class PravnickaOsobaModule {
}
