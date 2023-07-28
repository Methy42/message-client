

export class DelegatedEventTarget implements EventTarget {
    private delegate = globalThis.document ? document.createDocumentFragment() : new EventTarget();

    public addEventListener(...args: any): void {
        this.delegate.addEventListener.apply(this.delegate, args);
    }

    public dispatchEvent(...args: any): boolean {
        return this.delegate.dispatchEvent.apply(this.delegate, args);
    }

    public removeEventListener(...args: any): void {
        return this.delegate.removeEventListener.apply(this.delegate, args);
    }
}

export interface SetWindowSizeEvent extends Event {
    readonly type: "set-window-size";
    readonly width: number;
    readonly height: number;
}

export interface IEventMap {
    [key: string]: Event;
}

export interface EventMap extends IEventMap {
    "set-window-size": SetWindowSizeEvent;
}

export class Events extends DelegatedEventTarget {
    addEventListener<K extends keyof EventMap>(type: K & string, listener: (event: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
        super.addEventListener(type, listener, options);
    }
    dispatchEvent<K extends keyof EventMap>(event: EventMap[K]): boolean {
        return super.dispatchEvent(event);
    }
    removeEventListener<K extends keyof EventMap>(type: K & string, listener: (event: EventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        super.removeEventListener(type, listener, options);
    }
}

export default new Events();