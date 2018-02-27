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
    files$: BehaviorSubject<any[]> = new BehaviorSubject(null);

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
        const url = utils.get(this.form.value, name);

        if (url) {
            this.files$.next(null);

            this.http
                .getXml(url, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                .subscribe((response) => {
                    this.parser.parseString(response.body, (error, result) => this.update(result));
                });
        }
    }

    loadFile(name: string) {
        const files = utils.get(this.form.value, name);

        this.files$.next(files);
    }

    download(index: number) {
        const files = this.files$.getValue(),
            file = files && files[index];

        if (file) {
            saveAs(file);
        }
    }

    private update(content?: any) {
        const items = content && content.Podani.NovaOpravneniPO.DokumentPriloha || [],
            files = items.map((item) => {
                const name = item.DokumentObsah.$.nazevPrilohy,
                    type = item.DokumentObsah.$.contentType,
                    content = item.DokumentObsah._,
                    buffers = content && utils.atob(content),
                    file = buffers && new File(buffers, name, {type});

                return file;
            });

        this.files$.next(files);
    }
}
