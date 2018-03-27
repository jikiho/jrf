/**
 * Feature content toolbar component.
 */
import {Component, ChangeDetectionStrategy, Input, TemplateRef, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from './app.service';
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
     * Messages, titles and labels.
     */
    @Input()
    selectTitle: string = 'Výběr údajů';

    @Input()
    previousTitle: string = 'Předchozí údaje';

    @Input()
    nextTitle: string = 'Následující údaje';

    @Input()
    addLimitMessage: string = 'Omezení neumožňuje přidat nový záznam.';

    @Input()
    addTitle: string = 'Přidání údajů';

    @Input()
    addLabel: string = 'Přidat údaje';

    @Input()
    removeConfirmMessage: string = 'Dojde ke zrušení údajů, chcete pokračovat?';

    @Input()
    removeAllConfirmMessage: string = 'Dojde ke zrušení všech záznamů, chcete pokračovat?';

    @Input()
    removeTitle: string = 'Smazání údajů';

    @Input()
    removeLabel: string = 'Smazat údaje';

    constructor(private app: AppService) {
    }

    /**
     * Manages...
     */
    add() {
        if (this.content.free) {
            this.content.add();
        }
        else {
            this.app.alert(this.addLimitMessage);
        }
    }

    remove(index?: number) {
        if (this.app.confirm(this.removeConfirmMessage).result) {
            this.content.remove(index);
        }
    }

    removeAll() {
        if (this.app.confirm(this.removeAllConfirmMessage).result) {
            this.content.create();
        }
    }

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.a', ['$event'])
    private addOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.add();
        }
    }

    @HostListener('document:keydown.alt.r', ['$event'])
    private removeOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.remove();
        }
    }

    @HostListener('document:keydown.alt.shift.r', ['$event'])
    private removeAllOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.removeAll();
        }
    }

    @HostListener('document:keydown.alt.home', ['$event'])
    private firstOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.first();
        }
    }

    @HostListener('document:keydown.alt.end', ['$event'])
    private lastOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.last();
        }
    }

    @HostListener('document:keydown.alt.pageup', ['$event'])
    private previousOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.previous();
        }
    }

    @HostListener('document:keydown.alt.pagedown', ['$event'])
    private nextOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.content.next();
        }
    }
}
