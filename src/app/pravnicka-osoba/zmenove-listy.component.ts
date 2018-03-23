/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
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
    content: ContentModel<ZmenovyListModel> = this.data.content.zmenoveListy;

    vyberZivnosti = null;
    vybraneZivnosti = null;

    @ViewChild('form')
    form: NgForm;

    private changers: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        this.updateZivnosti();

        setTimeout(() => {
            this.changers.push(utils.changer(this.form.control, {
                'puvodniUdaj': ({values}) => this.updateUdaj(values),
                'novyUdaj': ({values}) => this.updateUdaj(values)
            }));
        });
    }

    ngOnDestroy() {
        while (this.changers.length) {
            this.changers.shift().unsubscribe();
        }
    }

    /**
     * Manages...
     */
    openVyberZivnosti() {
        this.vyberZivnosti = this.data.content.zivnosti.entries.map((entry) => entry.zivnost)
            .filter((item) => item && item.Kod);
        this.vybraneZivnosti = [...(this.content.entry.zivnost || [])];

        this.panelVyberZivnosti.nativeElement.showModal();
    }

    closeVyberZivnosti() {
        this.vyberZivnosti = this.vybraneZivnosti = null;

        this.panelVyberZivnosti.nativeElement.close();
    }

    applyVyberZivnosti() {
        const message = 'Omezení umožňuje vybrat nejvýše 3 živnosti.';

        if (this.vybraneZivnosti.length > 3) {
            this.app.alert(message);
        }
        else {
            this.applierVyberZivnosti();
        }
    }

    applierVyberZivnosti() {
        this.content.patch({
            zivnost: this.vybraneZivnosti
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
                    this.data.content.zivnosti.entries.find((entry) =>
                            entry.zivnost && entry.zivnost.Kod === item.Kod));
        });
    }

    private updateUdaj(value: any) {
        this.content.patch({
            overview: utils.some(value.puvodniUdaj, value.novyUdaj) ?
                    [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
        });
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
