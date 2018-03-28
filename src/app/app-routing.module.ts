/**
 * Main application routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes} from '@angular/router';
import {Router, ActivatedRoute, RouterEvent, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';

import {AppService} from './app.service';
import {ConfigService} from './config.service';
import {PravnickaOsobaRoutes} from './pravnicka-osoba/pravnicka-osoba-routing.module';
import {UvodniStrankaRoutes} from './uvodni-stranka/uvodni-stranka-routing.module';

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
            provide: 'Stop',
            useValue: () => false
        }
    ]
})
export class AppRoutingModule {
    constructor(private router: Router, private route: ActivatedRoute,
            private app: AppService, private config: ConfigService) {
        if (this.config.debug) {
            this.router.events.subscribe((event: RouterEvent) => this.debugRouterEvent(event));
        }
    }

    /**
     * Debug router events.
     */
    private debugRouterEvent(event: RouterEvent) {
        if (event instanceof NavigationEnd) {
            console.debug('ROUTE', event.urlAfterRedirects, this.app.historyState);
        }
        else if (event instanceof NavigationCancel) {
            console.debug('CANCEL ROUTE', event.url, event.reason);
        }
        else if (event instanceof NavigationError) {
            //console.debug('FAILED ROUTE', event.url, this.router, this.route);
        }
    }
}
