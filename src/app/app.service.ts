/**
 * Main application service.
 */
import {Injectable, Inject, LOCALE_ID, Component} from '@angular/core';
import {PlatformLocation} from '@angular/common';
//import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {ConfigService} from './config.service';
import {HistoryStateModel} from './history-state.model';
import {ProcessService, TaskModel} from './process.service';
import {UtilsModule as utils} from './utils.module';

@Injectable()
export class AppService {
    /**
     * Application unique identification.
     */
    id: string;

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
     * International...
     */
    collator: Intl.Collator;
    
    /**
     * Initializes the application.
     */
    constructor(@Inject(LOCALE_ID) public readonly locale: string, //locale string
            private router: Router, private route: ActivatedRoute, private location: PlatformLocation,
            private config: ConfigService, private process: ProcessService) {
        if (!this.config.production || this.config.debug) {
            Object.assign(window, {app: this, utils});
        }

        document.documentElement.setAttribute('lang', utils.localeLang(locale));

        this.collator = new Intl.Collator(locale);
    }

    /**
     * Navigates the a route.
     */
    navigate(url: any, extras?: {}): Promise<boolean> {
        const commands = Array.isArray(url) ? url : [url];

        return this.router.navigate(commands, extras);
    }

    /**
     * Renavigates to a route to reset a content.
     */
    renavigate(url: any, extras?: {}): Promise<boolean> {
        return this.router.navigate(['/'], {skipLocationChange: true}).then(() => {
            return this.navigate(url, extras);
        });
    }

    /**
     * Handles an application failure, e.g. a request error.
     */
    failure(...args) {
        const messages = [];

        console.log(args);

        for (let arg of args) {
            if (arg instanceof Error) {
                messages.push(arg.message);
            }
            else {
                messages.push(utils.stringify(arg));
            }
        }

        this.alert(messages.join('\n-\n'));
    }

    /**
     * Simple application alert dialog.
     */
    alert(value: any, handler?: Function): TaskModel {
        const message = utils.stringify(value);

        utils.keydowns.clear();

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

        utils.keydowns.clear();

        return this.process.task({
            subject: () => window.confirm(message) || null, //ignore false result
            handler,
            cancelable: false
        });
    }
}
