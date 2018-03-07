/**
 * Main application routing module with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes, RouteReuseStrategy as NgRouteReuseStrategy, Router, ActivatedRoute, RouterEvent, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';

import {AppService} from './app.service';
import {ConfigService} from './config.service';
import {RouteReuseStrategy} from './route-reuse-strategy';
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
            provide: NgRouteReuseStrategy,
            useClass: RouteReuseStrategy
        },
        {
            provide: 'stop',
            useValue: () => false
        }
    ]
})
export class AppRoutingModule {
    constructor(private router: Router, private route: ActivatedRoute,
            private app: AppService, private config: ConfigService) {
        //this.router.events.subscribe((event: RouterEvent) => this.onRouterEvent(event));
    }

    /**
     * Handles router events.
     */
    private onRouterEvent(event: RouterEvent) {
        if (event instanceof NavigationEnd) {
            if (this.config.debug) {
                console.debug('ROUTE', event.urlAfterRedirects, this.app.historyState);
            }
        }
        else if (event instanceof NavigationCancel) {
            if (this.config.debug) {
                console.debug('CANCEL ROUTE', event.url, event.reason);
            }
        }
        else if (event instanceof NavigationError) {
            if (this.config.debug) {
                //console.debug('FAILED ROUTE', event.url, this.router, this.route);
            }
        }
    }
}
