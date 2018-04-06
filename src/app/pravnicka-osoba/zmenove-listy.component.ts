/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
//TODO: separate dialog form
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {ContentsService} from './contents.service';
import {UtilsModule as utils} from '../utils.module';
import {ZmenovyListModel} from './zmenovy-list.model';

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<ZmenovyListModel> = this.contents.zmenoveListy;

    vyberZivnosti = {
        seznamZivnosti: null,
        zivnost: null
    };

    @ViewChild('form')
    form: NgForm;

    //@ViewChild('formVyberZivnosti')
    //formVyberZivnosti: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, private contents: ContentsService) {
    }

    ngOnInit() {
        this.updateZivnosti();

        setTimeout(() => {
            const control = this.form.control;

            this.updateUdaj();

            this.changes.push(control.get('puvodniUdaj').valueChanges
                .merge(control.get('novyUdaj').valueChanges)
                .debounceTime(1) //reset
                .subscribe(() => this.updateUdaj()));
        });

        Object.assign(this.vyberZivnosti, {
            seznamZivnosti: this.contents.zivnosti.entries.map((entry) => entry.zivnost)
                    .filter((item) => item && item.Kod)
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }

    /**
     * Manages...
     */
    openVyberZivnosti() {
        Object.assign(this.vyberZivnosti, {
            zivnost: [...(this.content.entry.zivnost || [])]
        });

        this.panelVyberZivnosti.nativeElement.showModal();
    }

    closeVyberZivnosti() {
        // just close like escape
        this.panelVyberZivnosti.nativeElement.close();
    }

    applyVyberZivnosti() {
        const message = 'Omezení umožňuje vybrat nejvýše 3 živnosti.';

        if (utils.numeric(this.vyberZivnosti.zivnost) > 3) {
            this.app.alert(message);
        }
        else {
            this.applierVyberZivnosti();
        }
    }

    applierVyberZivnosti() {
        const entry = this.content.entry;

        Object.assign(entry, {
            zivnost: this.vyberZivnosti.zivnost
        });

        this.closeVyberZivnosti();
    }

    removeZivnost(index: number) {
        const message = 'Dojde ke smazání živnosti z výběru, chcete pokračovat?',
            entry = this.content.entry,
            items = entry.zivnost,
            item = items[index];

        if (item) {
            if (this.app.confirm(message).result) {
                items.splice(index, 1);
            }
        }
    }

    trackZivnost(index: number, item: any) {
        return item.Kod;
    }

    /**
     * Updates...
     */
    private updateZivnosti() {
        this.content.entries.forEach((entry) => {
            entry.zivnost = entry.zivnost.filter((item) =>
                    this.contents.zivnosti.entries.find((entry) =>
                            entry.zivnost && entry.zivnost.Kod === item.Kod));
        });
    }

    private updateUdaj() {
        const entry = this.content.entry,
            value = entry.value;

        Object.assign(entry.state, {
            udaje: utils.some(value.puvodniUdaj, value.novyUdaj) ?
                    [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
        });

        // apply complex content changes
        this.cdr.markForCheck();
    }

    /**
     * Controls...
     */
    @ViewChild('panelVyberZivnosti')
    private panelVyberZivnosti: ElementRef;

    @ViewChild('inputPuvodniUdaj')
    private inputPuvodniUdaj: ElementRef;

    @ViewChild('inputNovyUdaj')
    private inputNovyUdaj: ElementRef;

    @HostListener('document:keydown.alt.2')
    private focusPuvodniUdajOnKey() {
        this.inputPuvodniUdaj.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.3')
    private focusNovyUdajOnKey() {
        this.inputNovyUdaj.nativeElement.focus();
    }
}
