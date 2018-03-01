/**
 * "Pravnicka osoba" feature routing module with configuration.
 *
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';

import {PodnikatelComponent} from './podnikatel.component';
import {ZivnostiComponent} from './zivnosti.component';

/**
 * Routing configuration.
 */
const routes: Routes = [
    {
        path: 'pravnicka-osoba',
        children: [
            {
                path: 'podnikatel',
                component: PodnikatelComponent
            },
            {
                path: 'zivnosti',
                component: ZivnostiComponent
            },
            {
                path: '**',
                redirectTo: 'podnikatel'
            }
        ]
    }
]

@NgModule({
    imports: [
        NgRouterModule.forChild(routes)
    ]
})
export class RoutingModule {
}
