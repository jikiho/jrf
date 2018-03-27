/**
 * "Pravnicka osoba" feature menu component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {DataService} from './data.service';
import {UtilsModule as utils} from '../utils.module';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    /**
     * Links scope.
     */
    @ViewChild('links')
    private scope: ElementRef;

    @ViewChild('inputLoadFile')
    private inputLoadFile: ElementRef;

    constructor(private app: AppService, public data: DataService) {
    }

    /**
     * Manages...
     */
    create() {
        const message = 'Vytvoření nového podání proběhlo v pořádku.';

        if (this.loose()) {
            if (this.data.content.create()) {
                this.refresh(message);
            }
        }
    }

    loadFile() {
        if (this.loose()) {
            this.inputLoadFile.nativeElement.click();
        }
    }

    load() {
        const message = 'Načtení údajů podání proběhlo v pořádku.',
            input: HTMLInputElement = this.inputLoadFile.nativeElement,
            files = Array.from(input.files),
            file = files[0];

        if (file) {
            this.data.content.load(file)
                .then((content) => {
                    if (this.data.content.create(content)) {
                        this.refresh(message);
                    }
                })
                .catch(({message, error}) => {
                    this.app.failure(message, error);
                });
        }
    }

    save() {
        const message = 'Uložení údajů podání proběhlo v pořádku.';

        if (this.data.content.save()) {
            this.app.alert(message);
        }
    }

    check() {
        const message = ['Kontrola údajů podání proběhla v pořádku.', 'Podání obsahuje chyby.'],
            errors = this.data.content.validate();

        if (!errors) {
            this.app.alert(message[0]);
        }
        else {
            this.app.alert([message[1], ...errors]);
        }
    }

    /**
     * Checks loosing content.
     */
    private loose(): boolean {
        const message = 'Dojde ke smazání údajů podání, chcete pokračovat?';

        return !this.data.content.dirty ||
                this.app.confirm(message).result;
    }

    /**
     * Refreshes contents.
     */
    private refresh(message?: string) {
        this.app.renavigate('/pravnicka-osoba/podnikatel');

        if (message) {
            setTimeout(() => this.app.alert(message));
        }
    }

    /**
     * Actual list of available links.
     */
    private get links(): HTMLElement[] {
        return Array.from(this.scope.nativeElement.querySelectorAll('[routerLink]:not([disabled])'));
    }

    /**
     * Makes a previous/next link active (click on it).
     */
    private shift(value: number) {
        let links = this.links,
            length = links.length,
            index = links.findIndex((link) => link.classList.contains('active')),
            link = index > -1 && value ? links[(index + value + length) % length] : undefined;

        if (link) {
            setTimeout(() => link.click());
        }
    }

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.n', ['$event'])
    private createOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.create();
        }
    }

    @HostListener('document:keydown.alt.o', ['$event'])
    private loadOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.loadFile();
        }
    }

    @HostListener('document:keydown.alt.s', ['$event'])
    private saveOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.save();
        }
    }

    @HostListener('document:keydown.alt.arrowleft', ['$event', '-1'])
    @HostListener('document:keydown.alt.arrowright', ['$event', '1'])
    private shiftOnKey(event: KeyboardEvent, value: string) {
        if (utils.keydown(event)) {
            this.shift(parseInt(value));
        }
    }
}
