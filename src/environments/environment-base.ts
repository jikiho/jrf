/**
 * Base of the application environment configuration.
 * 
 * @example
 *      export const environment = new EnvironmentBase({
 *          ...
 *      });
 */
export class EnvironmentBase {
    /**
     * Flag to run the application in production mode.
     */
    production: boolean = false;

    /**
     * Frontend build version.
     */
    version: string = '${build.version}';

    /**
     * Frontend build identification (timestamp).
     */
    build: string = '${build.timestamp}';

    /**
     * Allow request cache (read).
     */
    requestCache: boolean = true;

    /**
     * Allow response cache (write).
     */
    responseCache: boolean = true;

    /**
     * Request timeout (milliseconds).
     */
    requestTimeout: number = 180000;

    /**
     * Allow and limit number of standard request retries.
     */
    requestRetries: number = 0;

    /**
     * Delay to standard request retry (milliseconds).
     */
    requestRetryDelay: number = 1000;

    /**
     * Default request accept type.
     */
    requestAcceptType: string = 'text/xml';

    /**
     * Delay to resume a suspended request resource base url (milliseconds).
     */
    resourceResumeDelay: number = 60000;

    /**
     * Flag to get an active request resource (next or the current one).
     */
    resourceGetNext: boolean = true;

    /**
     * Request resources as a map of names and urls.
     * A name represents a protocol, e.g. "api" is used as "api:pathname".
     * You can also use the window location to construct the url.
     *
     * @example
     *      api: location.origin + location.pathname.replace(/-test$/, '-rest-test')
     */
    resources: {
        [name: string]: string|string[]
    }

    constructor(config?: any) {
        if (config) {
            Object.assign(this, config);
        }
    }
}
