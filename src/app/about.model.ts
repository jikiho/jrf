/**
 * Collection of information about the application.
 */
import {Version as Angular, VERSION} from '@angular/core';

import {Model} from './model';

export class AboutModel extends Model<AboutModel> {
    angular: Angular = VERSION;
    backend: string;
    frontend: string;
    locale: string;
    location: Location = window.location;
    navigator: Navigator = window.navigator;
    requested: string;
    responsed: Date;
    started: Date;
}
