/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {DataService} from './data.service';
import {Model} from '../model';
import {UtilsModule as utils} from '../utils.module';

class ZivnostModel extends Model<ZivnostModel> {
    druhZivnosti: string;
    skupinaZivnosti: string;
    zivnost: string;
    nazev: string;
    oborZivnosti: string[];
    selected: boolean;
}

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent implements OnInit {
    /**
     * List of feature entries (stream);
     */
    entries$ = new BehaviorSubject<ZivnostModel[]>(null);

    get entries(): ZivnostModel[] {
        return this.entries$.getValue();
    }

    get selectedIndex(): number {
        return this.entries.findIndex((item) => item.selected);
    }

    /**
     * Form values (streams).
     */
    druhZivnosti$: Observable<string>;
    skupinaZivnosti$: Observable<string>;
    zivnost$: Observable<string>;

    /**
     * Form reference.
     */
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskey5')
    private accesskey5: ElementRef;

    constructor(private cdr: ChangeDetectorRef,
            public app: AppService, private data: DataService) {
    }

    ngOnInit() {
        this.settleValueChanges();
        setTimeout(() => this.init());
    }

    @HostListener('window:unload')
    ngOnDestroy() {
        this.synchronize();
    }

    init() {
        const storage = this.data.storage.zivnosti as any,
            entries = storage.entries || [new ZivnostModel({selected: true})],
            value = storage.value;

        this.entries$.next(entries);

        if (value) {
            this.form.reset(value);
        }
    }

    synchronize() {
        this.data.storage.update({
            zivnosti: {
                entries: this.entries,
                value: this.form.value
            }
        });
    }

    add(data?: any): ZivnostModel {
        const entries = this.entries,
            selected = entries.find((item) => item.selected),
            entry = new ZivnostModel(data),
            length = entries.push(entry);

        this.entries$.next(entries);

        setTimeout(() => {
            this.select(length - 1);
        });

        return entry;
    }

    remove(index: number): ZivnostModel {
        if (!this.app.confirm(`Dojde k odebrání živnosti č. ${index + 1}, chcete pokračovat?`).result) return;

        const entries = this.entries,
            entry = entries.splice(index, 1)[0],
            last = entries.length - 1;

        if (entry) {
            if (entry.selected) {
                this.select(Math.min(index, last));
            }

            this.entries$.next(entries);
        }

        if (!entries.length) {
            setTimeout(() => this.add(), 250);
        }

        return entry;
    }

private selecting: boolean;
    select(index: number): ZivnostModel {
        const entries = this.entries,
            selected = entries.find((item) => item.selected),
            entry = entries[index];

        if (selected) {
            selected.update({
                selected: false
            });
        }

        if (entry) {
            entry.update({
                selected: true
            });

this.selecting = true;
            this.form.reset(entry);
this.selecting = false;

            this.entries$.next(entries);
        }

        return entry;
    }

    update(data: any): ZivnostModel {
        const entries = this.entries,
            entry = entries && entries.find((item) => item.selected);

        if (entry) {
            entry.update(data);

            this.entries$.next(entries);
        }

        return entry;
    }

    @HostListener('document:keydown.alt.5')
    private access5OnKey() {
        this.accesskey5.nativeElement.focus();
    }

    private settleValueChanges() {
        this.druhZivnosti$ = utils.controlValueChanges(this.form, 'druhZivnosti');

        this.druhZivnosti$.subscribe((value) => {
            const defaultValue = '';

            this.form.control.patchValue({
                skupinaZivnosti: defaultValue,
                zivnost: ''
            });

if (!this.selecting) {
            this.update({
                druhZivnosti: value
            });
}
        });

        this.skupinaZivnosti$ = utils.controlValueChanges(this.form, 'skupinaZivnosti');

        this.skupinaZivnosti$.subscribe((value) => {
            const defaultValue = '';

            this.form.control.patchValue({
                zivnost: defaultValue
            });

if (!this.selecting) {
            this.update({
                skupinaZivnosti: value
            });
}
        });

        this.zivnost$ = utils.controlValueChanges(this.form, 'zivnost');

        this.zivnost$.subscribe((value) => {
            const items = value && utils.filter(this.data.zivnost$.getValue(), {Kod: value}),
                item = items[0] || {};

if (!this.selecting) {
            this.update({
                zivnost: value,
                nazev: item.Hodnota
            });
}
        });
    }
}
