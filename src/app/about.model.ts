/**
 * Collection of information about the application.
 */
import {Version as Angular, VERSION} from '@angular/core';

import {Model} from './model';

export class AboutModel extends Model<AboutModel> {
    /**
     * Angular version.
     */
    angular: Angular = VERSION;

    /**
     * Backend version.
     */
    backend: string;

    /**
     * Frontend version (build and timestamp).
     */
    frontend: string;

    /**
     * Application locale.
     */
    locale: string;

    /**
     * Window location (url).
     */
    location: Location;

    /**
     * Window navigator (browser).
     */
    navigator: Navigator;

    /**
     * Last request timestamp.
     */
    requested: Date;

    /**
     * Last response timestamp.
     */
    responsed: Date;

    /**
     * Application start timestamp.
     */
    started: Date;
}
