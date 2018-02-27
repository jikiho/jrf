/**
 * Provides a standard response handling.
 */
import {HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ConfigService} from '../config.service';

export class ResponseInterceptor implements HttpInterceptor {
    constructor(private app: AppService, private config: ConfigService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .do((response) => {
                this.app.about({
                    responsed: new Date()
                });

                if (response instanceof HttpResponse) {
                    if (this.config.debug) {
                        console.debug('RESPONSE', response.status,
                                response.url || request.urlWithParams, response);
                    }
                }
            })
    }
}
