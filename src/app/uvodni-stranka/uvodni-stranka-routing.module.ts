/**
 * "Uvodni stranka" feature routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';

import {UvodniStrankaComponent} from './uvodni-stranka.component';

/**
 * Routing configuration.
 */
export const UvodniStrankaRoutes: Routes = [
    {
        path: '',
        component: UvodniStrankaComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

/*
const routes: Routes = [
    {
        path: '',
        children: UvodniStrankaRoutes
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
export class UvodniStrankaRoutingModule {
}
*/
