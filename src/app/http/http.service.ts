/**
 * Provides request/response.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService extends HttpClient {
    xmlPost(url: string, body: any | null, options?: any): Observable<any> {
        return this.post(url, body, Object.assign({
            headers: {
                'Accept': 'text/xml'
            },
            observe: 'response',
            responseType: 'text'
        }, options));
    }

    xmlFile(content: string, name: string = 'request.xml'): File {
        return new File([content], name, {
            type: 'text/xml'
        });
    }

    formData(params?: any): FormData {
        const data = new FormData();

        for (let [name, value] of Object.entries(params)) {
            if (value instanceof File) {
                data.append(name, value, value.name);
            }
            else {
                data.append(name, value);
            }
        }

        return data;
    }
}
