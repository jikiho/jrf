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
     * Content entry model class.
     */
    //private Model: T;

//TODO
    private app = AppService.self;

    constructor(private Model: Constructor<T>, limit: number = 1) {
        this.limit = limit;
        this.free = this.limit ? this.limit : -1;
        this.single = this.limit === 1;

        if (!this.length) {
            this.createEntry(); //first entry
        }
    }

    patch(value: any): T {
        return Object.assign(this.entry, {...this.entry as any, ...value});
    }

    /**
     * Creates a new current content entry.
     */
    create(value?: any) {
        const message = 'Omezení neumožňuje přidat nový záznam.';

        if (this.free) {
            if (this.createEntry(value)) {
                //this.resetValue();
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
                //this.resetValue();
            }
        }
    }

    select(index?: number) {
        if (this.selectEntry(index)) {
            //this.resetValue();
        }
    }

    previous() {
        if (this.previousEntry()) {
            //this.resetValue();
        }
    }

    next() {
        if (this.nextEntry()) {
            //this.resetValue();
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

            return this.update(entries, length - 1);
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

        return this.update(entries, index);
    }

    /**
     * Unselects a content entry.
     */
    private unselectEntry(): T {
        return this.update(this.entries, -1);
    }

    /**
     * Selects an existing content entry.
     */
    private selectEntry(value: number = this.index): T {
        const entries = this.entries,
            index = value < 0 ? 0 : Math.min(entries.length - 1, value);

        return this.update(entries, index);
    }

    /**
     * Shifts a selected content entry index to an existing one.
     */
    private shift(value: number): T {
        const entries = this.entries,
            index = Math.min(entries.length - 1, Math.max(0, this.index + value));

        return this.update(entries, index);
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
     * Updates content state.
     */
    private update(entries: T[] = this.entries, index: number = this.index,
            entry: T = entries[index]): T {
        if (index > -1) {
            entries[index] = entry;
        }

        this.length = entries.length;
        this.free = this.limit ? this.limit - this.length : -1;
        this.last = this.length - 1;
        this.index = entry ? index : -1;
        this.current = this.index + 1;
        this.entry = entries[this.index];

        return entry;
    }
}
