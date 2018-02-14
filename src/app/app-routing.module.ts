/**
 * Main application routing with configuration.
 */
import {NgModule} from '@angular/core';
import {RouterModule as NgRouterModule, Routes, RouteReuseStrategy as NgRouteReuseStrategy, Router, ActivatedRoute, RouterEvent, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';

import {AddressComponent} from './address.component';
import {AppService} from './app.service';
import {ConfigService} from './config.service';
import {HomeComponent} from './home.component';
import {RouteReuseStrategy} from './route-reuse-strategy';

/**
 * Routing configuration.
 */
const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'adresa',
        component: AddressComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

/**
 * Returns a false value (e.g. to stop routing).
 */
export function getFalse(): boolean {
    return false;
}

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
            useValue: getFalse
        }
    ]
})
export class AppRoutingModule {
    constructor(private router: Router, private route: ActivatedRoute,
            private app: AppService, private config: ConfigService) {
        this.router.events.subscribe((event: RouterEvent) => this.onRouterEvent(event));
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
