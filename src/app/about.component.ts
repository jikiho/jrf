/**
 * Simple...
 */
import {Component, ChangeDetectionStrategy} from '@angular/core';

import {AppService} from './app.service';

@Component({
    selector: 'about-component',
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    constructor(public app: AppService) {
    }
}
