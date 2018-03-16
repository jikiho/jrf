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
     * Titles and labels.
     */
    @Input()
    selectTitle: string = 'Výběr údajů';

    @Input()
    toggleTitle: string = 'Zobrazení souhrnných údajů';

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

    @Input()
    dirtyTitle: string = 'Upravené údaje...';

    /**
     * Control...
     */
    @HostListener('document:keydown.alt.l')
    private toggleOnKey() {
        utils.stopEvent(event);
        this.content.toggle();
    }

    @HostListener('document:keydown.alt.n')
    private createOnKey() {
        utils.stopEvent(event);
        this.content.create();
    }

    @HostListener('document:keydown.alt.r')
    private removeOnKey() {
        utils.stopEvent(event);
        this.content.remove();
    }

    @HostListener('document:keydown.control.arrowup')
    private previousOnKey() {
        utils.stopEvent(event);
        this.content.previous();
    }

    @HostListener('document:keydown.control.arrowdown')
    private nextOnKey() {
        utils.stopEvent(event);
        this.content.next();
    }
}
