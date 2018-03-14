/**
 * Main application service.
 */
import {Injectable, Inject, LOCALE_ID, Component} from '@angular/core';
import {PlatformLocation} from '@angular/common';
//import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute, NavigationExtras, RouterEvent, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {AboutModel} from './about.model';
import {ConfigService} from './config.service';
import {HistoryStateModel} from './history-state.model';
import {ProcessService, TaskModel} from './process.service';
import {UtilsModule as utils} from './utils.module';

@Injectable()
export class AppService {
    static self: AppService;

    /**
     * Information about the application (stream).
     */
    about$ = new BehaviorSubject<AboutModel>(null);

    /**
     * Information about active route (stream).
     */
    route$ = new BehaviorSubject<any>(null);

    /**
     * Application unique identification.
     */
    get id(): string {
        return this.about$.getValue().id;
    }

    /**
     * Navigation history state.
     */
    get historyState(): HistoryStateModel {
        return new HistoryStateModel(history.state);
    }

    /**
     * Main application component reference.
     *
     * @example active primary router-outlet component
     *      app.component.active
     */
    component: Component;

    /**
     * Initializes the application.
     */
    constructor(@Inject(LOCALE_ID) public readonly locale: string, //locale string
            private router: Router, private route: ActivatedRoute, private location: PlatformLocation,
            private config: ConfigService, private process: ProcessService) {
        AppService.self = this;

        //if (this.config.debug) {
            Object.assign(window, {app: this, utils});
        //}

        document.documentElement.setAttribute('lang', utils.localeLang(locale));

        this.settleAbout();

        this.router.events.subscribe((event: RouterEvent) =>
                this.onRouterEvent(event));
    }

    /**
     * Navigates...
     */
    navigate(params: any = '/', search?: any): Promise<boolean> {
        const commands = Array.isArray(params) ? params : [params],
            extras: NavigationExtras = {
                preserveQueryParams: false,
                preserveFragment: false
            };

        if (search) {
            extras.queryParams = search;
        }

        return this.router.navigate(commands, extras);
    }

    /**
     * Simple application alert dialog.
     */
    alert(value: any, handler?: Function): TaskModel {
        const message = utils.stringify(value);

        return this.process.task({
            subject: () => window.alert(message),
            handler,
            force: true,
            cancelable: false
        });
    }

    /**
     * Simple application confirm dialog.
     *
     * @example result property
     *      if (app.confirm(message).result) {
     *          console.log('YES');
     *      }
     *
     * @example true callback
     *      app.confirm(message, () => console.log('YES'));
     *
     * @example callback
     *      app.confirm(message, (result) => console.log(result ? 'YES' : 'NO'), true);
     */
    confirm(value: any, handler?: Function, force: boolean = false): TaskModel {
        const message = utils.stringify(value);

        return this.process.task({
            subject: () => window.confirm(message) || null, //ignore false result
            handler,
            cancelable: false
        });
    }

    /**
     * Updates information about the aplication.
     */
    about(...args) {
        const about = this.about$.getValue();

        this.about$.next(new AboutModel(about, ...args));
    }

    /**
     * Initializes and handles information about the application.
     */
    private settleAbout() {
        const started = new Date(),
            base = this.location.getBaseHrefFromDOM() || '';

        this.about({
            backend: {
                full: undefined
            },
            frontend: {
                full: utils.concat(this.config.version, this.config.build) || undefined
            },
            id: utils.md5([window.navigator.userAgent, started]),
            locale: this.locale,
            base: new URL(base, window.location.origin),
            location: window.location,
            navigator: window.navigator,
            viewport: window['visualViewport'],
            started
        });

        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => this.about()); //update location

        Observable.fromEvent(window, 'resize')
            .map((event: Event) => event.target['visualViewport'])
            .subscribe((viewport) => this.about(viewport)); //update viewport
    }

    /**
     * Handles router events.
     */
    private onRouterEvent(event: RouterEvent) {
        if (event instanceof NavigationEnd) {
            this.route$.next({
                //outlet: this.route.snapshot.outlet,
                //component: this.route.snapshot.component.name,
                params: this.route.snapshot.params,
                query: this.route.snapshot.queryParams,
                fragment: this.route.snapshot.fragment,
                navigationId: this.router['navigationId'], //private
                url: event.urlAfterRedirects
            });

            if (this.config.debug) {
                console.debug('ROUTE', event.urlAfterRedirects, this.historyState);
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
