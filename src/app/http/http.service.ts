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

        Object.entries(params).forEach(([name, param]) => {
            if (param instanceof File) {
                data.append(name, param, param.name);
            }
            else {
                data.append(name, param);
            }
        });

        return data;
    }
}
