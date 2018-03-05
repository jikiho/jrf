/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent implements OnInit {
    items$ = new BehaviorSubject<any[]>(null);

    @ViewChild('form')
    private form: NgForm;

    ngOnInit() {
        this.form.valueChanges.subscribe((value) => {
            
        });
    }
}
