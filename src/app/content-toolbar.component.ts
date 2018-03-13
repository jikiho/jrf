/**
 * Feature content toolbar component.
 */
import {Component, ChangeDetectionStrategy, Input, TemplateRef, ViewChild, ElementRef, HostListener} from '@angular/core';

import {ContentModel} from './content.model';

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
    @Input() selectTitle: string = 'Výběr záznamu';
    @Input() toggleTitle: string = 'Zobrazení seznamu záznamů';
    @Input() previousTitle: string = 'Předchozí záznam';
    @Input() nextTitle: string = 'Následující záznam';
    @Input() addTitle: string = 'Přidání záznamu';
    @Input() addLabel: string = 'Přidat záznam';
    @Input() removeTitle: string = 'Smazání záznamu';
    @Input() removeLabel: string = 'Smazat záznam';
    @Input() dirtyTitle: string = 'Upravené údaje...';

    /**
     * Control...
     */
    private stopEvent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    @HostListener('document:keydown.alt.l')
    private toggleOnKey() {
        this.stopEvent(event);
        this.content.toggle();
    }

    @HostListener('document:keydown.alt.n')
    private createOnKey() {
        this.stopEvent(event);
        this.content.create();
    }

    @HostListener('document:keydown.alt.r')
    private removeOnKey() {
        this.stopEvent(event);
        this.content.remove();
    }

    @HostListener('document:keydown.control.arrowup')
    private previousOnKey() {
        this.stopEvent(event);
        this.content.previous();
    }

    @HostListener('document:keydown.control.arrowdown')
    private nextOnKey() {
        this.stopEvent(event);
        this.content.next();
    }
}
