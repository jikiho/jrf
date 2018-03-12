/**
 * Feature component base.
 */
import {Component, OnInit, OnDestroy, ViewChild, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from './app.service';
import {ContentModel} from './content.model';

export class FeatureComponentBase implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel;

    /**
     * Form....
     */
    get dirty(): boolean {
        return this.form.dirty;
    }

    @ViewChild('form')
    protected form: NgForm;

    private synchronizer;

    private synchronizing: boolean;

    /**
     * Duration time for the form/content synchronization (milliseconds).
     */
    protected duration: number = 250;

    constructor(private app: AppService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.resetValue();

            this.synchronizer = this.form.valueChanges.debounceTime(this.duration)
                .map((value) => this.update(value))
                .takeWhile((value) => value)
                .subscribe((value) => this.setValue(value));
        });
    }

    ngOnDestroy() {
        if (this.synchronizer) {
            this.synchronizer.unsubscribe();
        }
    }

    create() {
        if (this.content.free) {
            if (this.content.create({value: this.form.value})) {
                this.resetValue();
            }
        }
        else {
            this.app.alert('Omezení neumožňuje přidat nový záznam.');
        }
    }

    save() {
//TODO: check validity
    }

    remove(index?: number) {
        if (this.confirmRemove()) {
            if (this.content.entry !== this.content.remove(index)) {
                this.resetValue();
            }
        }
    }

    select(index?: number) {
        if (this.content.select(index)) {
            this.resetValue();
        }
    }

    previous() {
        if (this.content.previous()) {
            this.resetValue();
        }
    }

    next() {
        if (this.content.next()) {
            this.resetValue();
        }
    }

    protected confirmRemove(): boolean {
        const message = 'Dojde ke zrušení údajů, chcete pokračovat?';

        return this.app.confirm(message).result;
    }

    protected update(value: any): any {
        return value;
    }

    protected setValue(value: any = this.form.value) {
console.log("SET ENTRY", value);
        if (!this.synchronizing) {
            this.synchronizing = true;
            this.content.assign(value);
            this.synchronizing = false;
        }
    }

    protected resetValue(value: any = this.content.entry) {
console.log("RESET FORM", value);
        if (!this.synchronizing) {
            this.synchronizing = true;
            this.form.reset(value);
            this.synchronizing = false;
        }
    }

    private stopEvent(event: Event): boolean {
        event.stopPropagation();
        event.preventDefault();

        return false;
    }

    @HostListener('document:keydown.alt.n')
    private createOnKey() {
        this.stopEvent(event);
        this.create();
    }

    @HostListener('document:keydown.control.arrowup')
    private previousOnKey() {
        this.stopEvent(event);
        this.previous();
    }

    @HostListener('document:keydown.control.arrowdown')
    private nextOnKey() {
        this.stopEvent(event);
        this.next();
    }

    @HostListener('document:keydown.alt.r')
    private removeOnKey() {
        this.stopEvent(event);
        this.remove();
    }

    @HostListener('document:keydown.alt.l')
    private toggleOnKey() {
        this.stopEvent(event);
        this.content.toggle();
    }
}
