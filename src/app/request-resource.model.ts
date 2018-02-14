/**
 * Request resource model with a configuration and management.
 */
import {HttpErrorResponse} from '@angular/common/http';

import {ConfigService} from './config.service';

export class RequestResourceModel {
    /**
     * List of available resource bases.
     */
    //private bases: string[];

    /**
     * List of suspended base urls with corresponding resume timers.
     */
    private suspends: Map<string, number> = new Map();

    /**
     * Index of the last used base url.
     */
    private index: number = -1;

    constructor(private bases: string[], private config: ConfigService) {
    }

    /**
     * Gets an active base url,
     * or resumes and uses the first suspended one.
     */
    get(next: boolean = this.config.resourceGetNext): string {
        const length = this.bases.length;
        let i = length,
            index = this.index < 0 ? 0 : this.index + (next ? 1 : 0),
            url: string;

        while (i--) {
            index %= length;
            url = this.bases[index];

            if (!this.suspends.has(url)) {
                this.index = index;

                return url;
            }

            index += 1;
        }

        // first suspended
        url = this.suspends.keys().next().value;
        this.resume(url);

        this.index = this.bases.indexOf(url);

        return url;
    }

    /**
     * Handles a failed request and returns if it's suitable to retry.
     * If suspendable, the failed request base url is suspended.
     */
    retry(error: HttpErrorResponse, base: string): boolean {
        const suspendable = this.config.resourceSuspendables.has(error.status);
        let delay = this.config.resourceResumeDelay;

        if (suspendable) {
            if (error.status === 524) {
                delay = Math.max(delay, 250 + this.config.requestTimeout);
            }

            if (this.suspend(base, delay)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Suspends a base url and initializes the resume timer.
     */
    private suspend(base: string, delay: number): boolean {
        if (this.bases.length > 1) {
            if (this.suspends.has(base)) {
                if (this.config.debug) {
                    console.debug('SUSPENDED RESOURCE', base);
                }
            }
            else {
                const timer: number = window.setTimeout(() => this.resume(base), delay);

                if (this.config.debug) {
                    console.debug('SUSPEND RESOURCE', base);
                }

                this.suspends.set(base, timer);
            }

            return this.bases.length > this.suspends.size;
        }

        return false;
    }

    /**
     * Resumes a base url.
     */
    private resume(base: string) {
        const timer: number = this.suspends.get(base);

        if (timer) {
            if (this.config.debug) {
                console.debug('RESUME RESOURCE', base);
            }

            this.suspends.delete(base);

            clearTimeout(timer);
        }
    }
}
