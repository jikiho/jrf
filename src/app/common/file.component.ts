/**
 * Component with information about a file.
 */
import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Component({
    selector: 'file-component',
    templateUrl: './file.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {
    @Input()
    routerLink: any[] | string;

    @Input()
    file: File;

    @Input()
    title: string = '';

    @Input()
    openTitle: string = 'Otevření souboru...';

    icon: boolean = false;

    @Input('icon')
    private set _icon(value: string | boolean) {
        this.icon = value === '' || !!value;
    }

    /**
     * Opens a file.
     */
    open() {
        if (this.file) {
            utils.openFile(this.file);
        }
    }
}
