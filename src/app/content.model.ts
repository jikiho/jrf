/**
 * Feature content model.
 */
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs/Rx';

import {AppService} from './app.service';

interface Constructor<T> {
    new(value?: any): T;
}

export class ContentModel<T> {
    /**
     * List of content entries.
     */
    entries: T[] = [];

    /**
     * List of content entries (stream) to detect changes.
     */
    entries$ = new BehaviorSubject<T[]>(this.entries);

    /**
     * List length.
     */
    length: number;

    /**
     * Index of a current content entry.
     */
    index: number = -1;

    /**
     * Current content entry number, starts from 1.
     */
    current: number;

    /**
     * Last content entry index.
     *
     * @example select the last content entry
     *      content.select(content.last);
     */
    last: number;

    /**
     * Current content entry.
     */
    entry: T;

    /**
     * Limit of content entries number, or 0 for unlimited.
     */
    limit: number;

    /**
     * Number of "free" entries, or -1 for unlimited.
     */
    free: number;

    /**
     * Single entry content.
     */
    single: boolean;

    /**
     * Form....
     */
    form: NgForm;

    get value(): any {
        return this.form.value;
    }

    get dirty(): boolean {
        return this.form.dirty;
    }

    /**
     * Synchronization...
     */
    private subsSync: Subscription

    /**
     * Duration time for the synchronization (milliseconds).
     */
    private duration: number = 250;

    /**
     * Content entry model class.
     */
    //private Model: T;

    private app = AppService.self;

    constructor(private Model: Constructor<T>, limit: number = 1) {
        this.limit = limit;
        this.free = this.limit ? this.limit : -1;
        this.single = this.limit === 1;
    }

    /**
     * Initializes content and synchronization.
     */
    init(form: NgForm, update?: (value) => any): BehaviorSubject<T[]> {
        this.form = form;

        if (!this.length) {
            this.createEntry(); //first entry
        }

        setTimeout(() => {
            this.resetValue();

            this.subsSync = this.form.valueChanges.debounceTime(this.duration)
                .map(update ? update : (value) => value)
                .takeWhile((value) => value)
                .subscribe((value) => this.setValue(value));
        });

        return this.entries$;
    }

    /**
     * Destroys...
     */
    destroy() {
        if (this.subsSync) {
            this.subsSync.unsubscribe();
        }
    }

    /**
     * Assigns a current content entry values.
     */
    assign(...args) {
        Object.assign(this.entry as any, ...args);

        return this.set();
    }

    /**
     * Patches form value.
     */
    patchValue(value: any) {
        this.form.control.patchValue(value);
    }

    /**
     * Creates a new current content entry.
     */
    create(value?: any) {
        const message = 'Omezení neumožňuje přidat nový záznam.';

        if (this.free) {
            if (this.createEntry(value)) {
                this.resetValue();
            }
        }
        else {
            this.app.alert(message);
        }
    }

    save() {
//TODO: check validity
    }

    remove(index?: number) {
        const message = 'Dojde ke zrušení údajů, chcete pokračovat?';

        if (this.app.confirm(message).result) {
            if (this.entry !== this.removeEntry(index)) {
                this.resetValue();
            }
        }
    }

    select(index?: number) {
        if (this.selectEntry(index)) {
            this.resetValue();
        }
    }

    previous() {
        if (this.previousEntry()) {
            this.resetValue();
        }
    }

    next() {
        if (this.nextEntry()) {
            this.resetValue();
        }
    }

    /**
     * Creates a new current content entry.
     */
    private createEntry(value?: any): T {
        if (this.free) {
            const entries = this.entries,
                entry = new this.Model(value), //model class
                length = entries.push(entry);

            return this.set(entries, length - 1);
        }
    }

    /**
     * Removes a content entry.
     * Recalculates the new selected content entry index.
     *
     * @example determine a current entry change
     *      if (content.entry !== content.remove()) {
     *          console.log('New current content entry', content.entry);
     *      }
     */
    private removeEntry(index: number = this.index): T {
        const entries = this.entries,
            removed = entries.splice(index, 1);

        if (this.limit) {
            this.free += removed.length;
        }

        if (!entries.length) {
            return this.createEntry();
        }

        if (entries.length <= this.index) {
            index = entries.length - 1;
        }
        else if (index < this.index) {
            index = this.index - 1;
        }
        else {
            index = this.index;
        }

        return this.set(entries, index);
    }

    /**
     * Unselects a content entry.
     */
    private unselectEntry(): T {
        return this.set(this.entries, -1);
    }

    /**
     * Selects an existing content entry.
     */
    private selectEntry(value: number = this.index): T {
        const entries = this.entries,
            index = value < 0 ? 0 : Math.min(entries.length - 1, value);

        return this.set(entries, index);
    }

    /**
     * Shifts a selected content entry index to an existing one.
     */
    private shift(value: number): T {
        const entries = this.entries,
            index = Math.min(entries.length - 1, Math.max(0, this.index + value));

        return this.set(entries, index);
    }

    /**
     * Selects the previous content entry.
     */
    private previousEntry(): T {
        return this.shift(-1);
    }

    /**
     * Selects the next content entry.
     */
    private nextEntry(): T {
        return this.shift(1);
    }

    /**
     * Sets content state.
     */
    private set(entries: T[] = this.entries, index: number = this.index,
            entry: T = entries[index]): T {
//console.log("SET CONTENT", index, entry);
        if (index > -1) {
            entries[index] = entry;
        }

        this.length = entries.length;
        this.free = this.limit ? this.limit - this.length : -1;
        this.last = this.length - 1;
        this.index = entry ? index : -1;
        this.current = this.index + 1;
        this.entry = entries[this.index];

        this.entries$.next([...entries]);

        return entry;
    }

    /**
     * Synchronizes a current content entry value with form.
     */
    private setValue(value: any = this.value) {
//console.log("SET VALUE", value);
        this.assign(value);
    }

    /**
     * Resets a form value.
     */
    private resetValue(value: any = this.entry) {
//console.log("RESET VALUE", value);
        this.form.reset(value);
    }
}
