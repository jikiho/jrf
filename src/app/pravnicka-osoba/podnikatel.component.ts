/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {DataService} from './data.service';
import {Model} from '../model';
import {UtilsModule as utils} from '../utils.module';

class PodnikatelModel extends Model<PodnikatelModel> {
}

@Component({
    templateUrl: './podnikatel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodnikatelComponent implements OnInit, OnDestroy {
    /**
     * Entry.
     */
    item$ = new BehaviorSubject<PodnikatelModel>(null);

    /**
     * Form values (streams).
     */
    okres$: Observable<string>;
    stat$: Observable<string>;

    /**
     * Form reference.
     */
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskey1')
    private accesskey1: ElementRef;

    @ViewChild('accesskey2')
    private accesskey2: ElementRef;

    get podnikatelQueriable(): boolean {
        return utils.dirty(this.form.value.nazev, this.form.value.ico);
    }

    get adresaQueriable(): boolean {
        return utils.dirty(this.form.value.ulice) && utils.dirty(this.form.value.obec) &&
                utils.dirty(this.form.value.cislo, this.form.value.orientacni);
    }

    constructor(private app: AppService, private data: DataService) {
    }

    ngOnInit() {
        this.settleChanges();
        setTimeout(() => this.initValues());
    }

    @HostListener('window:unload')
    ngOnDestroy() {
        this.updateValues();
    }

    @HostListener('document:keydown.alt.1')
    private access1OnKey() {
        this.accesskey1.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.2')
    private access2OnKey() {
        this.accesskey2.nativeElement.focus();
    }

    private settleChanges() {
        this.okres$ = utils.controlValueChanges(this.form, 'okres');

        this.okres$.subscribe((value) => {
console.log("OKRES", value);
            if (value) {
                this.form.control.patchValue({
                    stat: 'CZ'
                });
            }
        });

        this.stat$ = utils.controlValueChanges(this.form, 'stat');

        this.stat$.subscribe((value) => {
            if (value != 'CZ') {
                this.form.control.patchValue({
                    okres: ''
                });
            }
        });
    }

    private initValues() {
        const storage = this.data.storage.podnikatel as any,
            value = storage.form || {};

        if (value) {
            this.form.reset(value);
        }
    }

    private updateValues() {
        this.data.storage.update({
            podnikatel: {
                //item: {},
                form: this.form.value
            }
        });
    }
}
