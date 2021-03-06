/**
 * "Pravnicka osoba" feature routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';

import {OstatniComponent} from './ostatni.component';
import {PodnikatelComponent} from './podnikatel.component';
import {ZivnostiComponent} from './zivnosti.component';
import {ZmenoveListyComponent} from './zmenove-listy.component';

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
        path: 'ostatni',
        component: OstatniComponent
    },
    {
        path: 'zmenove-listy',
        component: ZmenoveListyComponent
    },
    {
        path: ':action',
        component: PodnikatelComponent,
        canActivate: ['Stop']
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
