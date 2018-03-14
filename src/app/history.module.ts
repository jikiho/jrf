/**
 * Navigation history enhancement.
 *
 * The history state contains an application id, an initial navigation id and timestamp, and
 * a history popped timestamp for an item from the history (back/forward).
 */
import {NgModule} from '@angular/core';
import {PlatformLocation, PopStateEvent} from '@angular/common'
import {Router, RouterEvent, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';

import {AppService} from './app.service';
import {HistoryStateModel} from './history-state.model';

@NgModule({
})
export class HistoryModule {
    constructor(private location: PlatformLocation, private router: Router,
            private app: AppService) {
        this.settleState();
    }

    /**
     * Initializes and handles navigation history state.
     */
    private settleState() {
        const location = this.location,
            pushState = location.pushState,
            replaceState = location.replaceState;

        let state: any;

        location.onPopState((event: PopStateEvent) => {
            const popped = event['state'];

            if (popped && this.app.id === popped.applicationId) {
                state = new HistoryStateModel(popped, {
                    popped: new Date()
                });
            }
        });

        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd || event instanceof NavigationCancel ||
                    event instanceof NavigationError) {
                state = undefined;
            }
        });

        Object.assign(location, {
            pushState: (arg: any, ...args) => pushState.call(location,
                    arg || state || this.initState(), ...args),

            replaceState: (arg: any, ...args) => replaceState.call(location,
                    arg || state || this.initState(), ...args)
        });
    }

    /**
     * Initializes a new navigation history state.
     */
    private initState(): HistoryStateModel {
        const applicationId = this.app.id,
            navigationId = this.router['navigationId'], //private
            navigated = new Date();

        return new HistoryStateModel({applicationId, navigationId, navigated});
    }
}
