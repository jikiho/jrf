/**
 * Feature content toolbar component.
 */
import {Component, ChangeDetectionStrategy, Input, TemplateRef, ViewChild, ElementRef, HostListener} from '@angular/core';

import {ContentModel} from './content.model';
import {UtilsModule as utils} from './utils.module';

@Component({
    selector: 'content-toolbar-component',
    templateUrl: './content-toolbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentToolbarComponent {
    /**
     * Feature content.
     */
    @Input()
    content: ContentModel<any>;

    /**
     * Header content (columns).
     */
    @Input()
    header: TemplateRef<any>;

    /**
     * Body content (columns).
     */
    @Input()
    body: TemplateRef<any>;

    /**
     * Flag to show entries list.
     */
    list: boolean = false;

    @Input('list')
    private set _list(value: any) {
        this.list = value !== false;
    }

    /**
     * Titles and labels.
     */
    @Input()
    selectTitle: string = 'Výběr údajů';

    @Input()
    previousTitle: string = 'Předchozí údaje';

    @Input()
    nextTitle: string = 'Následující údaje';

    @Input()
    addTitle: string = 'Přidání údajů';

    @Input()
    addLabel: string = 'Přidat údaje';

    @Input()
    removeTitle: string = 'Smazání údajů';

    @Input()
    removeLabel: string = 'Smazat údaje';

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.n', ['$event'])
    private createOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.create();
        }
    }

    @HostListener('document:keydown.alt.r', ['$event'])
    private removeOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.remove();
        }
    }

    /*
    @HostListener('document:keydown.alt.l', ['$event'])
    private selectOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.select();
        }
    }
    */

    @HostListener('document:keydown.control.arrowup', ['$event'])
    private previousOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.previous();
        }
    }

    @HostListener('document:keydown.control.arrowdown', ['$event'])
    private nextOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.next();
        }
    }
}
