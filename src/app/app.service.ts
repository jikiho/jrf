/**
 * Provides the main application properties and management.
 */
import {Injectable, Inject, LOCALE_ID, Component} from '@angular/core';
import {PlatformLocation} from '@angular/common';
//import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {AboutModel} from './about.model';
import {ConfigService} from './config.service';
import {HistoryStateModel} from './history-state.model';
import {ProcessService, TaskModel} from './process.service';
import {UtilsModule as utils} from './utils.module';

@Injectable()
export class AppService {
    /**
     * Information about the application (stream).
     */
    about$: BehaviorSubject<AboutModel> = new BehaviorSubject<AboutModel>(null);

    /**
     * Current application unique identification.
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
    constructor(private router: Router, private route: ActivatedRoute, private location: PlatformLocation,
            @Inject(LOCALE_ID) public readonly locale: string, //locale string
            private config: ConfigService, private process: ProcessService) {
        // global references
        Object.assign(window, {app: this, utils});

        document.documentElement.setAttribute('lang', utils.localeLang(locale));

        this.settleAbout();
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
}
