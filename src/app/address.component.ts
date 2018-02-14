/**
 * Address feature component.
 */
import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {Builder, Parser} from 'xml2js';

import {HttpService} from './http/http.service';

@Component({
    selector: 'address-component',
    templateUrl: './address.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements AfterViewInit {
    response$: BehaviorSubject<string> = new BehaviorSubject(null);

    input: any;

    @ViewChild('form')
    private form: NgForm;

    private builder = new Builder();

    private parser = new Parser({
        explicitArray: false
    });

    constructor(private http: HttpService) {
    }

    ngAfterViewInit() {
        setTimeout(() => this.form.reset({
            stat: 'CZ',
            obec: 'Praha 10',
            ulice: 'Na Nežárce',
            cisloOrientacni: 4
        }));
    }

    @HostListener('submit', ['$event'])
    private submit(event?: Event) {
        const content = this.getXmlValue(this.form.value),
            file = this.http.xmlFile(content),
            body = this.http.formData({
                VSS_SERV: 'ZUMJRFADR',
                filename: file
            }),
            request = this.http.xmlPost('api:', body, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

        request.subscribe(response => {
            this.parser.parseString(response.body, (error, result) => this.setXmlValue(result));
        });
    }

    private setXmlValue(result: any) {
        let value = result.KlientOdpoved.OvereniAdresy.Adresa;

        if (Array.isArray(value)) {
            value = value[0];
        }

        this.form.reset({
            stat: value.Stat.$.kod,
            obec: value.Obec._,
            castObce: value.CastObce._,
            ulice: value.Ulice,
            cisloDomovni: value.CisloDomovni,
            cisloOrientacni: value.CisloOrientacni,
            psc: value.PSC
        });
    }

    private getXmlValue(value: any): string {
        return this.builder.buildObject({
            KlientPozadavek: {
                $: {
                    version: '1.0',
                    xmlns: 'urn:cz:isvs:rzp:schemas:Podani:v1'
                },
                OvereniAdresy: {
                    Stat: {
                        $: {
                            kod: value.stat
                        }
                    },
                    Obec: value.obec,
                    CastObce: value.castObce,
                    Ulice: value.ulice,
                    CisloDomovni: value.cisloDomovni,
                    CisloOrientacni: value.cisloOrientacni,
                    PSC: value.psc
                }
            }
        });
    }
}
