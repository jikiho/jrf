/**
 * Provides request/response.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService extends HttpClient {
    xmlPost(url: string, body: any | null, options: any = {}): Observable<any> {
        const headers = new HttpHeaders(options.headers)
            .set('Accept', 'text/xml');

        return this.post(url, body, Object.assign({
            observe: 'response',
            responseType: 'text'
        }, options, {
            headers
        }));
    }

    xmlFile(content: string, name: string = 'request.xml'): File {
        return new File([content], name, {
            type: 'text/xml'
        });
    }

    formData(params?: any): FormData {
        const data = new FormData();

        Object.entries(params).forEach(([name, value]) => {
            if (value instanceof File) {
                data.append(name, <Blob>value, value.name);
            }
            else {
                data.append(name, <string>value);
            }
        });

        return data;
    }
}
