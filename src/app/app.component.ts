/**
 * Main application component.
 */
import {Component, ChangeDetectionStrategy, OnInit, HostListener} from '@angular/core';

import {AppService} from './app.service';
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

    constructor(private process: ProcessService,
            public app: AppService) {
    }

    /**
     * Sets the main application component reference.
     */
    ngOnInit() {
        this.app.component = <Component>this;
    }

    /**
     * Emits a cancel event.
     */
    @HostListener('document:keydown.Escape', ['$event'])
    private cancelOnEscape(event: KeyboardEvent) {
        this.process.cancel(event);
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
}
