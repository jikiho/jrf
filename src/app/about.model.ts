/**
 * Model with information about the application.
 */
import {Version as Angular, VERSION} from '@angular/core';

import {Model} from './model';

export class AboutModel extends Model<AboutModel> {
    name: string = 'JRF';

    /**
     * Angular version.
     */
    angular: Angular = VERSION;

    /**
     * Backend version.
     */
    backend: {
        full: string
    };

    /**
     * Frontend version.
     */
    frontend: {
        full: string;
    };

    /**
     * Application unique identification.
     */
    id: string;

    /**
     * Application locale.
     */
    locale: string;

    /**
     * Document base location (window).
     */
    base: URL;

    /**
     * Document location (window).
     */
    location: Location;

    /**
     * User agent identification and state (window).
     */
    navigator: Navigator;

    /**
     * Visual viewport property (window).
     */
    viewport: any;

    /**
     * Last response timestamp.
     */
    responsed: Date;

    /**
     * Application start timestamp.
     */
    started: Date;
}
