/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';
import {Getter} from '../utils.module';

class ZmenovyListModel {
    value: any;

    @Getter('value')
    zmenovyList: string;

    @Getter('value')
    zivnosti: any[];

    @Getter('value')
    puvodniUdaj: string;

    @Getter('value')
    novyUdaj: string;
}

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent extends FeatureComponentBase {
    constructor(app: AppService, private data: DataService) {
        super(app);

        this.content = this.data.content.zmenoveListy = this.data.content.zmenoveListy ||
                new ContentModel(() => new ZmenovyListModel(), 3);
    }

    handlePuvodniUdaj() {
        /*
        this.content.update({
            value: this.getValue(),
            puvodniUdaj: this.form.value.puvodniUdaj
        });
        */
    }

    handleNovyUdaj() {
        /*
        this.content.update({
            value: this.getValue(),
            novyUdaj: this.form.value.novyUdaj
        });
        */
    }
}
