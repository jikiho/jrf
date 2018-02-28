/**
 * Provides a request resource and retries.
 */
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ConfigService} from '../config.service';
import {RequestResourceModel} from '../request-resource.model';
import {UtilsModule as utils} from '../utils.module';

export class RequestInterceptor implements HttpInterceptor {
    constructor(private app: AppService, private config: ConfigService) {
    }

    /**
     * Prepares a resource and calls for a request.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = new URL(request.url, document.baseURI),
            resource = this.config.resources.get(url.protocol);

        return this.makeRequest(request, next, url.pathname, resource);
    }

    /**
     * Makes or retries a request.
     */
    private makeRequest(original: HttpRequest<any>, next: HttpHandler,
            pathname: string, resource: RequestResourceModel, retry: number = 0): Observable<HttpEvent<any>> {
        const base = resource && resource.get(retry > 0), //active resource base url
            request = !base ? original : original.clone({
                url: utils.mergeUrl(base, pathname).toString()
            });

        if (this.config.debug) {
            console.debug(`${retry ? 'RETRY ' : ''}${request.method || 'REQUEST'}`,
                    request.urlWithParams, request);
        }

        return next.handle(request)
            .retryWhen((errors) => {
                // standard request retry
                return this.retryable(errors);
            })
            .catch((error: Error) => {
                if (error instanceof HttpErrorResponse) {
                    if (resource && resource.retry(error, base)) {
                        return this.makeRequest(original, next, pathname, resource, retry += 1);
                    }

                    return Observable.throw(new HttpErrorResponse(Object.assign(error, {
                        url: error.url || request.urlWithParams
                    })));
                }

                return Observable.throw(error);
            });
    }

    /**
     * Determines retryable request on a request error.
     */
    private retryable(errors: Observable<Error>): Observable<any> {
        const retries = this.config.requestRetries,
            delay = this.config.requestRetryDelay;

        return errors.flatMap((error: Error, index: number) => {
            if (error instanceof HttpErrorResponse) {
                if (retries > index) {
                    return Observable.of(index).delay(delay);
                }
            }

            return Observable.throw(error);
        });
    }
}
