/**
 * Provides a request/response language (locale).
 *
 * Using the "Accept-Language" header to pass a request configuration.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
 */
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {UtilsModule as utils} from '../utils.module';

export class LanguageInterceptor implements HttpInterceptor {
    constructor(private app: AppService) {
    }

    /**
     * Prepares language settings and calls for a request.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const locale = request.headers.get('Accept-Language') || this.app.locale;

        if (locale) {
            return this.makeRequest(request, next, locale);
        }

        return next.handle(request);
    }

    /**
     * Makes a request with language settings.
     */
    private makeRequest(original: HttpRequest<any>, next: HttpHandler,
            locale: string): Observable<HttpEvent<any>> {
        const lang = utils.localeLang(locale),
            request = original.clone({
                headers: original.headers.set('Accept-Language', locale),
                params: original.params.set('lang', lang)
            });

        return next.handle(request);
    }
}
