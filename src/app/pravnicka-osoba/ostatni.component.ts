/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
//TODO: zero on reset, now empty value
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {OstatniModel, OstatniPrilohaModel} from './ostatni.model';
import {UtilsModule as utils} from '../utils.module';

@Component({
    templateUrl: './ostatni.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstatniComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<OstatniModel> = this.data.content.ostatni;

    @ViewChild('form')
    form: NgForm;

    @ViewChild('inputAddPrilohaFile')
    private inputAddPrilohaFile: ElementRef;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.updatePocetPriloh(this.form.value);

            this.changes.push(this.form.control.valueChanges
                .debounceTime(1) //add, reset...
                .subscribe((value) => this.updatePocetPriloh(value)));
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }

    /**
     * Adds...
     */
    addPrilohaFile() {
        this.inputAddPrilohaFile.nativeElement.click();
    }

    addPriloha(input: HTMLInputElement) {
        const message = 'Není možné přidat znvou stejnou elektronickou přílohu.',
            files = Array.from(input.files),
            entry = this.content.entry,
            items = entry.prilohy;

        input.value = '';

        for (let file of files) {
            const hash = this.hash(file);

            if (items.findIndex((item) => item.hash === hash) > -1) {
                this.app.alert(message);
            }
            else {
                const item = new OstatniPrilohaModel({hash, file}),
                    size = entry.velikostPriloh;

                items.push(item);

                items.sort((a, b) => this.app.collator.compare(a.file.name, b.file.name));

                this.content.patch({
                    velikostPriloh: size + file.size
                });
            }
        }
    }

    /**
     * Removes...
     */
    removePriloha(index: number) {
        const message = 'Dojde ke smazání elektronické přílohy, chcete pokračovat?',
            entry = this.content.entry,
            items = entry.prilohy,
            item = items[index];

        if (item) {
            if (this.app.confirm(message).result) {
                const file = item.file,
                    size = entry.velikostPriloh;

                items.splice(index, 1);

                this.content.patch({
                    velikostPriloh: size - file.size
                });
            }
        }
    }

    trackPrilohy(index: number, item: OstatniPrilohaModel) {
        return item.hash;
    }

    /**
     * Gets a file unique hash (ignore content).
     */
    private hash(file: File): string {
        const value = {name: file.name, type: file.type, size: file.size};

        return utils.md5(value);
    }

    /**
     * Updates...
     */
    private updatePocetPriloh(value: any) {
        const entry = this.content.entry,
            names = Object.keys(entry.pocetPriloh),
            count = names.reduce((count, name) => Object.assign(count, {[name]: 0}), {}); //zero

        let totalCount = 0;

        Object.values(entry.prilohy).map(({hash}) => value.prilohy && value.prilohy[hash]).forEach((item) => {
            names.forEach((name) => {
                if (value.uradyPrilohy[name] && item && item.value.uradyPrilohy[name]) {
                    totalCount += 1;
                    count[name] += 1;
                }
            });
        });

        this.content.patch({
            pocetPriloh: count,
            overview: {
                pocetPriloh: totalCount
            }
        });

        // apply complex content changes
        this.cdr.markForCheck();
    }
}
