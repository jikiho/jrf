/**
 * "Pravnicka osoba" feature menu component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentsService} from './contents.service';
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

    constructor(private app: AppService, private contents: ContentsService) {
    }

    /**
     * Manages...
     */
    create() {
        const message = 'Vytvoření nového podání proběhlo v pořádku.';

        if (this.loose()) {
            if (this.contents.create()) {
                this.refresh(message);
            }
        }
    }

    loadFile() {
        if (this.loose()) {
            this.inputLoadFile.nativeElement.click();
        }
    }

    load(input: HTMLInputElement) {
        const message = 'Načtení údajů podání proběhlo v pořádku.',
            files = Array.from(input.files),
            file = files[0];

        input.value = '';

        if (file) {
            this.contents.load(file)
                .then((value) => {
                    if (this.contents.create(value)) {
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

        if (this.contents.save()) {
            this.app.alert(message);
        }
    }

    check() {
        const message = ['Kontrola údajů podání proběhla v pořádku.', 'Podání obsahuje chyby.'],
            errors = this.contents.validate();

        if (!errors) {
            this.app.alert(message[0]);
        }
        else {
            this.app.alert([message[1], ...errors]);
        }
    }

    close() {
        if (this.loose()) {
            if (this.contents.create()) {
                this.app.navigate();
            }
        }
    }

    /**
     * Checks loosing contents.
     */
    private loose(): boolean {
        const message = 'Dojde ke zrušení údajů podání, chcete pokračovat?';

        return !this.contents.dirty ||
                this.app.confirm(message).result;
    }

    /**
     * Refreshes contents.
     */
    private refresh(message?: string) {
        this.app.renavigate('/pravnicka-osoba/podnikatel');

        if (message) {
            setTimeout(() => this.app.alert(message), 250);
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

    @HostListener('document:keydown.alt.w', ['$event'])
    private closeOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.close();
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
