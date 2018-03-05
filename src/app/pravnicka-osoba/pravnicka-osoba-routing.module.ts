/**
 * "Pravnicka osoba" feature routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';

import {OdpovedniZastupciComponent} from './odpovedni-zastupci.component';
import {OstatniComponent} from './ostatni.component';
import {PodnikatelComponent} from './podnikatel.component';
import {ZivnostiComponent} from './zivnosti.component';
import {ZmenovyListComponent} from './zmenovy-list.component';

/**
 * Routing configuration.
 */
export const PravnickaOsobaRoutes: Routes = [
    {
        path: 'podnikatel',
        component: PodnikatelComponent
    },
    {
        path: 'zivnosti',
        component: ZivnostiComponent
    },
    {
        path: 'odpovedni-zastupci',
        component: OdpovedniZastupciComponent
    },
    {
        path: 'ostatni',
        component: OstatniComponent
    },
    {
        path: 'zmenovy-list',
        component: ZmenovyListComponent
    },
    {
        path: '**',
        redirectTo: 'podnikatel'
    }
];

/*
const routes: Routes = [
    {
        path: 'pravnicka-osoba',
        children: PravnickaOsobaRoutes
    }
];

@NgModule({
    imports: [
        NgRouterModule.forChild(routes)
    ],
    exports: [
        NgRouterModule
    ]
})
export class PravnickaOsobaRoutingModule {
}
*/
