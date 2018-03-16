/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {OstatniModel, OstatniPrilohyModel} from './ostatni.model';
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
    private form: NgForm;

    constructor(private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        this.content.init(this.form, (value) => this.update(value));
        this.update();
    }

    ngOnDestroy() {
        this.content.destroy();
    }

    /**
     * Adds...
     */
    addPrilohy(input: HTMLInputElement) {
        const message = 'Není možné přidat znvou stejnou elektronickou přílohu.',
            entry = this.content.entry,
            items = entry.prilohy,
            file = input.files[0];

        if (file) {
            const hash = this.hash(file);

            if (items.findIndex((item) => item.hash === hash) > -1) {
                this.app.alert(message);
            }
            else {
                const item = new OstatniPrilohyModel({hash, file}),
                    sum = entry.velikostPriloh;

                items.push(item);

                items.sort((a, b) => this.app.collator.compare(a.file.name, b.file.name));

                this.content.assign({
                    velikostPriloh: sum + file.size
                })
            }
        }

        input.value = '';
    }

    /**
     * Removes...
     */
    removePrilohy(index: number) {
        const message = 'Dojde ke smazání elektronické přílohy, chcete pokračovat?',
            entry = this.content.entry,
            items = entry.prilohy,
            item = items[index];

        if (item) {
            if (this.app.confirm(message).result) {
                const file = item.file,
                    sum = entry.velikostPriloh;

                items.splice(index, 1);

                this.content.assign({
                    velikostPriloh: sum - file.size
                })
            }
        }
    }

    trackHash(index: number, item: OstatniPrilohyModel) {
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
     * Updates counts.
     */
    private update(value?: any): any {
        const entry = this.content.entry,
            names = Object.keys(entry.pocetPriloh),
            count = names.reduce((count, name) => Object.assign(count, {[name]: 0}), {}); //zero

        if (value) {
            Object.entries(value.uradyPrilohy).reduce((count, [name, on]) => names.indexOf(name) > -1 ? count :
                Object.entries(on).reduce((count, [name, on]) => Object.assign(count, {
                    [name]: on ? count[name] + 1 : count[name]
                }), count), count);
        }

        this.content.assign({
            ostatniUdaje: new Date(),
            pocetPriloh: count
        });

        return value;
    }
}
