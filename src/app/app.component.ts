/**
 * Main application component.
 */
import {Component, ChangeDetectionStrategy, OnInit, HostListener} from '@angular/core';

import {AppService} from './app.service';
import {ConfigService} from './config.service';
import {ProcessService} from './process.service';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    /**
     * Active primary router-outlet component.
     */
    active: Component;

    constructor(public app: AppService, private config: ConfigService,
            private process: ProcessService) {
    }

    /**
     * Sets the main application component reference.
     */
    ngOnInit() {
        this.app.component = <Component>this;
    }

    /**
     * Updates an active primary router-outlet component.
     */
    activate(component: Component) {
        this.active = component;
    }

    /**
     * Clears an active primary router-outlet component.
     */
    deactivate(component?: Component) {
        if (!component || this.active === component) {
            this.active = undefined;
        }
    }

    /**
     * Emits a cancel event.
     */
    @HostListener('document:keydown.Escape', ['$event'])
    private cancelOnEscape(event: KeyboardEvent) {
        this.process.cancel(event);
    }

    /**
     * Requests standard window unload confirmation.
     *
     * Any interaction may be ignored (e.g. confirm method).
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
     */
    @HostListener('window:beforeunload', ['$event'])
    private beforeWindowUnload(event: BeforeUnloadEvent) {
        let value = this.config.confirmWindowUnload,
            active = !value && this.active && this.active['confirmWindowUnload'];

        if (active === true) {
            value = true;
        }
        else if (typeof active === 'function') {
            value = this.active['confirmWindowUnload'](event);
        }

        if (value) {
            return event.returnValue = '?';
        }
    }
}
