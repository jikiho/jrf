/**
 * Provides the application configuration and environment.
 */
import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {environment} from '../environments/environment';
import {RequestResourceModel} from './request-resource.model';

@Injectable()
export class ConfigService {
    /**
     * Flag to run the application in production mode.
     */
    production: boolean = environment.production;

    /**
     * Flag to debug the application.
     */
    get debug(): boolean {
        const debug = !this.production || this.queried('debug'),
            disabled = this.queried('debug', 'false');

        return debug && !disabled;
    }

    /**
     * Frontend build version.
     */
    version: string = !environment.version.indexOf('${') ? undefined :
            environment.version;

    /**
     * Frontend build identification (timestamp).
     */
    build: string = !environment.build.indexOf('${') ? undefined :
            environment.build;

    /**
     * Allow request canceling.
     */
    requestCancel: boolean = true;

    /**
     * Allow request cache.
     */
    requestCache: boolean = environment.requestCache;

    /**
     * Allow response cache (storage).
     */
    responseCache: boolean = environment.responseCache;

    /**
     * Request timeout (milliseconds).
     */
    requestTimeout: number = environment.requestTimeout;

    /**
     * Allow and limit number of standard request retries.
     */
    requestRetries: number = environment.requestRetries;

    /**
     * Delay to standard request retry (milliseconds).
     */
    requestRetryDelay: number = environment.requestRetryDelay;

    /**
     * Default request accept type.
     */
    requestAcceptType: string = environment.requestAcceptType;

    /**
     * Delay to resume a suspended request resource base url (milliseconds).
     */
    resourceResumeDelay: number = environment.resourceResumeDelay;

    /**
     * Flag to get an active resource base url (next or the current one).
     */
    resourceGetNext: boolean = environment.resourceGetNext;

    /**
     * List of failed request statuses suitable to suspend and retry.
     */
    resourceSuspendables: Set<number> = new Set([0, 500, 502, 503]);

    /**
     * Request resources.
     */
    resources = new Map<string, RequestResourceModel>();

    /**
     * Application environment.
     */
    private readonly environment = environment;

    constructor(private route: ActivatedRoute) {
        this.initRequestResources(environment.resources);
    }

    /**
     * Initializes request resources.
     */
    initRequestResources(resources: any = {}) {
        for (let [name, config] of Object.entries(resources)) {
            const protocol = `${name}:`,
                urls = config instanceof Array ? [...config] : [config],
                resource = new RequestResourceModel(urls, this);

            this.resources.set(protocol, resource);
        }
    }

    /**
     * Checks a route query parameter existance or value.
     */
    queried(name: string, ...args): boolean {
        const param = this.route.snapshot.queryParams[name];

        if (!args.length) {
            return param != null;
        }

        for (let value of args) {
            if (param == value) {
                return true;
            }
        }

        return false;
    }
}
