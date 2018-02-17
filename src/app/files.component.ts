//TODO: form, url input (load), upload (open), download (save)
/**
 * Files feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';
import {Parser} from 'xml2js';
import {saveAs} from 'file-saver';

import {HttpService} from './http/http.service';
import {UtilsModule as utils} from './utils.module';

@Component({
    selector: 'files-component',
    templateUrl: './files.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesComponent {
    items$: BehaviorSubject<any[]> = new BehaviorSubject(null);

    @ViewChild('form')
    private form: NgForm;

    private parser = new Parser({
        explicitArray: false
    });

    constructor(private http: HttpService) {
    }

    ngAfterViewInit() {
        setTimeout(() => this.form.reset({
            url: './assets/jrf-utf8.xml'
        }));
    }

    loadUrl(name: string) {
        const value = utils.getProperty(this.form.value, name);

        if (value) {
            this.items$.next(null);

            this.http
                .getXml(value, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                .subscribe(response => {
                    this.parser.parseString(response.body, (error, result) => this.update(result));
                });
        }
    }

    loadFile(name: string) {
        const value = utils.getProperty(this.form.value, name);

        if (value) {
            console.log(value);
        }
    }

    download(index: number) {
        const items = this.items$.getValue(),
            item = items && items[index],
            content = item && item.content,
            file: File = content && utils.asciiToFile(content, item.name, item.type);

        if (file) {
            saveAs(file);
        }
    }

    private update(content?: any) {
        const source = content && content.Podani.NovaOpravneniPO.DokumentPriloha || [],
            items = source.map(item => {
                const name = item.DokumentObsah.$.nazevPrilohy,
                    type = item.DokumentObsah.$.contentType,
                    content = item.DokumentObsah._;

                return {name, type, content};
            });

        this.items$.next(items);
    }
}
