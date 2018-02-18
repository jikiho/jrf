/**
 * Provides the main application properties and management.
 */
import {Injectable, Inject, LOCALE_ID, Component} from '@angular/core';
//import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs/Rx';

import {AboutModel} from './about.model';
import {ConfigService} from './config.service';
import {HistoryStateModel} from './history-state.model';
import {ProcessService, TaskModel} from './process.service';
import {UtilsModule as utils} from './utils.module';

@Injectable()
export class AppService {
    /**
     * Application start timestamp.
     */
    started = new Date();

    /**
     * Application identification.
     */
    id = utils.md5([window.navigator.userAgent, this.started]);

    /**
     * Navigation history state.
     */
    get historyState(): HistoryStateModel {
        return new HistoryStateModel(history.state);
    }

    /**
     * Information about the aplication (stream).
     */
    abouts$ = new BehaviorSubject<AboutModel>(null);

    /**
     * Information about the aplication.
     */
    get abouts(): AboutModel {
        return this.abouts$.getValue();
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
    constructor(private router: Router, private route: ActivatedRoute,
            @Inject(LOCALE_ID) public readonly locale: string, //application locale string
            private config: ConfigService, private process: ProcessService) {
        const lang = utils.localeLang(locale);

        document.documentElement.setAttribute('lang', lang);

        this.about({
            frontend: utils.concat(this.config.version, this.config.build) || undefined,
            locale: this.locale,
            location: window.location,
            navigator: window.navigator,
            started: this.started
        });

        // global reference
        Object.assign(window, {app: this, utils});
    }

    /**
     * Updates information about the aplication.
     */
    about(...args) {
        this.abouts$.next(new AboutModel(this.abouts, ...args));
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
     *      app.confirm(message, result => console.log(result ? 'YES' : 'NO'), true);
     */
    confirm(value: any, handler?: Function, force: boolean = false): TaskModel {
        const message = utils.stringify(value);

        return this.process.task({
            subject: () => window.confirm(message) || null, //ignore false result
            handler,
            cancelable: false
        });
    }
}
