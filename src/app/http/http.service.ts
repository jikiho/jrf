/**
 * Provides enhanced HTTP request methods.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService extends HttpClient {
    /**
     * Requests a XML resource.
     */
    getXml(url: string, options: any = {}): Observable<any> {
        const headers = new HttpHeaders(options.headers)
            .set('Accept', 'text/xml');

        return this.get(url, Object.assign({
            observe: 'response',
            responseType: 'text'
        }, options, {
            headers
        }));
    }

    /**
     * Sends and expects a XML resource.
     */
    postXml(url: string, body: any | null, options: any = {}): Observable<any> {
        const headers = new HttpHeaders(options.headers)
            .set('Accept', 'text/xml');

        return this.post(url, body, Object.assign({
            observe: 'response',
            responseType: 'text'
        }, options, {
            headers
        }));
    }
}
