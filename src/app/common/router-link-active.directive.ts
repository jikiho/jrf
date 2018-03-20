/**
 * Directive to control an active router link.
 *
 * Adds "active" CSS class to an element when the link's route becomes active,
 * unless the route looks like a directory (ends with "/").
 */
import {Directive, OnInit, Input} from '@angular/core';
import {RouterLinkActive} from '@angular/router';

@Directive({
    selector: 'a[routerLink]:not([routerLinkActive])'
})
export class RouterLinkActiveDirective extends RouterLinkActive implements OnInit {
    static ACTIVE_CLASS = 'active';

    private isDirectory: boolean = false;

    @Input()
    private set routerLink(commands: any) {
        this.isDirectory = /\/$/.test(Array.isArray(commands) ? commands.slice(-1)[0] : commands);
    }

    ngOnInit() {
        if (!this.routerLinkActive) {
            this.routerLinkActive = RouterLinkActiveDirective.ACTIVE_CLASS;

            this.routerLinkActiveOptions = {
                exact: this.isDirectory
            }
        }
    }
}
