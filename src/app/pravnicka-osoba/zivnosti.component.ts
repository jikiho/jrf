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
}

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent implements OnInit {
    /**
     * List of entries.
     */
    items$ = new BehaviorSubject<ZivnostModel>(null);

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
            private app: AppService, private data: DataService) {
    }

    ngOnInit() {
        this.settleValueChanges();
        setTimeout(() => this.initValues());
    }

    @HostListener('window:unload')
    ngOnDestroy() {
        this.updateValues();
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
        });

        this.skupinaZivnosti$ = utils.controlValueChanges(this.form, 'skupinaZivnosti');

        this.skupinaZivnosti$.subscribe((value) => {
            const defaultValue = '';

            this.form.control.patchValue({
                zivnost: defaultValue
            });
        });

        this.zivnost$ = utils.controlValueChanges(this.form, 'zivnost');
    }

    private initValues() {
        const storage = this.data.storage.zivnosti as any,
            value = storage.form || {};

        if (value) {
            this.form.reset(value);
        }
    }

    private updateValues() {
        this.data.storage.update({
            zivnosti: {
                items: this.items$.getValue(),
                form: this.form.value
            }
        });
    }
}
