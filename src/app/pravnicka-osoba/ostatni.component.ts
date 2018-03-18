/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, HostListener} from '@angular/core';
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

    get files(): string {
        const entry = this.content.entry,
            count = entry.prilohy.length,
            size = entry.velikostPriloh;

        return `${utils.unavailable(count || undefined)} (${utils.bytes(size)})`;
    }

    @ViewChild('form')
    form: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.changes.push(this.form.control.valueChanges
                .subscribe((value) => this.update(value)));

            this.update(this.form.value);
        });
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * Adds...
     */
    addPriloha(input: HTMLInputElement) {
        const message = 'Není možné přidat znvou stejnou elektronickou přílohu.',
            entry = this.content.entry,
            items = entry.prilohy,
            files = Array.from(input.files);

        for (let file of files) {
            const hash = this.hash(file);

            if (items.findIndex((item) => item.hash === hash) > -1) {
                this.app.alert(message);
            }
            else {
                const item = new OstatniPrilohaModel({hash, file}),
                    sum = entry.velikostPriloh;

                items.push(item);

                items.sort((a, b) => this.app.collator.compare(a.file.name, b.file.name));

                this.content.patch({
                    velikostPriloh: sum + file.size
                });
            }
        }

        input.value = '';
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
                    sum = entry.velikostPriloh;

                items.splice(index, 1);

                this.content.patch({
                    velikostPriloh: sum - file.size
                });
            }
        }
    }

    trackHash(index: number, item: OstatniPrilohaModel) {
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
    private update(value?: any) {
        const entry = this.content.entry,
            names = Object.keys(entry.pocetPriloh),
            count = names.reduce((count, name) => Object.assign(count, {[name]: 0}), {}); //zero

        Object.values(entry.prilohy).map(({hash}) => value.prilohy && value.prilohy[hash]).forEach((item) => {
            names.forEach((name) => {
                if (value.uradyPrilohy[name] && item && item.value.uradyPrilohy[name]) {
                    count[name] += 1;
                }
            });
        });

        this.content.patch({
            pocetPriloh: count
        });

        this.cdr.markForCheck();
    }
}
