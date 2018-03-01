/**
 * Component with information about the aplication.
 */
import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

import {AboutModel} from './about.model';

@Component({
    selector: 'about-component',
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    @Input()
    about: AboutModel;
}
