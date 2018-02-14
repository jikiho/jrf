/**
 * Application route reuse strategy.
 */
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy as NgRouteReuseStrategy} from '@angular/router';

export class RouteReuseStrategy implements NgRouteReuseStrategy {
    /**
     * Determines if a route should be reused.
     * False to start processing even with the same route configuration.
     */
    shouldReuseRoute(route: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        return false;
    }

    /**
     * Determines if a route should be detached to be reused later.
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    /**
     * Determines if a route should be reattached.
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    /**
     * Stores a detached route.
     * Storing a null value should erase the previously stored value.
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
    }

    /**
     * Retrieves a previously stored route.
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }
}
