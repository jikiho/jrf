/**
 * Main application routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';

import {UvodniStrankaRoutes} from './uvodni-stranka/uvodni-stranka-routing.module';
import {PravnickaOsobaRoutes} from './pravnicka-osoba/pravnicka-osoba-routing.module';

/**
 * Routing configuration.
 */
const routes: Routes = [
    {
        path: 'pravnicka-osoba',
        children: PravnickaOsobaRoutes
    },
    {
        path: '',
        children: UvodniStrankaRoutes
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        NgRouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload',
            useHash: true
        })
    ],
    exports: [
        NgRouterModule
    ],
    providers: [
        {
            provide: 'stop',
            useValue: () => false
        }
    ]
})
export class AppRoutingModule {
}
